import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";

import axiosRepositoryInstance from "../repository/AxiosRepository";
import styles from "./ForecastDashboard.module.css";
import getCroppedImg from "../utils/cropImage";
import { api } from "../services/api";
import { PatrimonyHeader } from "../components/patrimony/PatrimonyHeader";
import { ImageUploadCard } from "../components/patrimony/ImageUploadCard";
import { ImageCropModal } from "../components/patrimony/ImageCropModal";
import { EquityProgressBar } from "../components/patrimony/EquityProgressBar";
import priceBRL from "../utils/formatPrice"

export function PatrimonyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patrimony, setPatrimony] = useState(null);
  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Edit Transaction State
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // States for Image Crop
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [patRes, txRes] = await Promise.all([
        axiosRepositoryInstance.getPatrimonyById({ id }),
        axiosRepositoryInstance.getTransactionsByPatrimonyId(id)
      ]);
      setPatrimony(patRes.data.patrimony);
      setInstallments(txRes.data.transactions || []);
    } catch (err) {
      toast.error("Erro ao carregar detalhes do bem.");
      navigate("/patrimony");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [id]);

  const handleCreateInstallment = async (e) => {
    e.preventDefault();
    if (!amount || !dueDate || !description) {
      toast.warning("Preencha todos os campos da parcela.");
      return;
    }

    try {
      await axiosRepositoryInstance.createTransaction({
        type: "EXPENSE",
        amount: Number(amount),
        dueDate: new Date(dueDate),
        isPaid: false,
        isRecurring: false,
        source: "FINANCING",
        description,
        patrimonyId: id
      });

      toast.success("Parcela/Balão adicionado com sucesso!");
      setAmount("");
      setDueDate("");
      setDescription("");
      fetchData();
    } catch (err) {
      toast.error("Erro ao adicionar parcela.");
    }
  };

  const handleEditTransaction = async (e) => {
    e.preventDefault();
    if (!editAmount || !editDescription) {
      toast.warning("Preencha todos os campos.");
      return;
    }

    try {
      await axiosRepositoryInstance.updateTransaction(editingTransaction.id, {
        amount: Number(editAmount),
        description: editDescription
      });

      toast.success("Parcela atualizada com sucesso!");
      setEditingTransaction(null);
      fetchData(); // Recarrega os dados para a UI
    } catch (err) {
      toast.error("Erro ao atualizar parcela.");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageToCrop(reader.result);
        setCropModalOpen(true);
      });
      reader.readAsDataURL(file);
      e.target.value = null; // reset input
      return;
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSaveCrop = async (pixels = croppedAreaPixels) => {
    try {
      toast.info("Processando imagem...", { autoClose: 2000 });
      const croppedBlob = await getCroppedImg(imageToCrop, pixels);

      const file = new File([croppedBlob], "cropped.jpg", { type: "image/jpeg" });

      const response = await axiosRepositoryInstance.uploadFile(file);
      const { url } = response.data;

      const baseUrl = api.defaults.baseURL || "http://localhost:3333";
      const fullUrl = `${baseUrl}${url}`;

      await axiosRepositoryInstance.updatePatrimony(id, {
        realEstateDetails: {
          ...patrimony.realEstateDetails,
          imageUrl: fullUrl
        }
      });

      toast.success("Imagem atualizada com sucesso!", { theme: "colored" });
      fetchData();
      setCropModalOpen(false);
      setImageToCrop(null);
      setZoom(1);
    } catch (e) {
      toast.error("Erro ao salvar a imagem.");
    }
  };

  const handleRemoveFinancing = async () => {
    if (window.confirm("Tem certeza que deseja remover o financiamento deste bem? Isso apagará todas as parcelas pendentes projetadas.")) {
      try {
        await axiosRepositoryInstance.updatePatrimony(id, {
          isFinanced: false
        });
        toast.success("Financiamento removido com sucesso!");
        fetchData();
      } catch (err) {
        toast.error("Erro ao remover financiamento.");
      }
    }
  };

  if (loading) {
    return <div className={styles.container}><div className={styles.loading}>Carregando...</div></div>;
  }

  if (!patrimony) return null;

  const processedInstallments = installments.map((tx, i) => {
    const dt = new Date(tx.dueDate);
    return {
      ...tx,
      index: i + 1,
      date: dt,
      year: dt.getFullYear(),
      // Verifica se a parcela tem valor maior que o normal (Balão/Extra) usando 10% de margem
      hasBalloon: patrimony?.financingDetails && tx.amount > (patrimony.financingDetails.installmentValue * 1.1)
    };
  });

  const availableYears = [...new Set(processedInstallments.map(m => m.year))].sort();
  const installmentsToShow = processedInstallments.filter(m => m.year === selectedYear);

  const fipeValue = patrimony.marketValue || 0;
  const getRemainingInstallments = (details) => {
    if (!details || !details.endDate) return 0;
    const end = new Date(details.endDate);
    const now = new Date();
    const diff = (end.getUTCFullYear() - now.getFullYear()) * 12 + (end.getUTCMonth() - now.getMonth());
    return diff > 0 ? diff : 0;
  };
  const loanValue = patrimony.isFinanced ? ((patrimony.financingDetails?.installmentValue || 0) * getRemainingInstallments(patrimony.financingDetails)) : 0;
  const equity = fipeValue - loanValue;
  const equityPercent = fipeValue > 0 ? (equity / fipeValue) * 100 : 0;
  const annualProjection = (patrimony.financingDetails?.installmentValue || 0) * 12;

  return (
    <div className={styles.container}>
      <PatrimonyHeader
        title={patrimony.name}
        onBack={() => navigate("/patrimony")}
        rightAction={
          <button onClick={async () => {
            if(window.confirm("Tem certeza que deseja deletar este imóvel permanentemente?")) {
              try {
                await axiosRepositoryInstance.deletePatrimony({ id: patrimony.id });
                toast.success("Imóvel deletado com sucesso!");
                navigate("/patrimony");
              } catch (err) {
                toast.error("Erro ao deletar imóvel.");
              }
            }
          }} style={{ padding: "10px 20px", background: "#EF4444", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
            Deletar Imóvel
          </button>
        }
      >
        <span style={{ color: "#64748b", fontWeight: "600" }}>Valor de Mercado: {priceBRL(patrimony.marketValue)}</span>
      </PatrimonyHeader>

      {/* Imagem do Imóvel */}
      <ImageUploadCard
        imageUrl={patrimony.realEstateDetails?.imageUrl}
        onFileSelect={(file) => {
          if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
              setImageToCrop(reader.result);
              setCropModalOpen(true);
            });
            reader.readAsDataURL(file);
          }
        }}
        fallbackImage=""
      />

      {patrimony.isFinanced && (
        <section className={styles.chartSection} style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Evolução do Financiamento</h3>
            <button onClick={handleRemoveFinancing} style={{ background: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>
              Remover Financiamento
            </button>
          </div>
          <div style={{ display: "flex", gap: "24px", alignItems: "center", marginTop: "16px" }}>
            <div style={{ flex: 1 }}>
              <EquityProgressBar percent={equityPercent} label="Equity (Parte Paga)" />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "12px", color: "#64748B" }}>
                <span>Pago: {priceBRL(equity > 0 ? equity : 0)}</span>
                <span>Dívida Restante: {priceBRL(loanValue)}</span>
              </div>
            </div>

            <div style={{ flex: 1, padding: "16px", background: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#64748B" }}>Parcela Atual</span>
                <strong>{priceBRL(patrimony.financingDetails?.installmentValue || 0)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#64748B" }}>Projeção de Pagamento Anual</span>
                <strong style={{ color: "#10B981" }}>+ {priceBRL(annualProjection)}</strong>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className={styles.chartSection}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h3>Linha do Tempo Financeira</h3>
            <p style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>Clique em um mês para editar pagamentos, despesas extras (balões) ou anexar comprovantes.</p>
          </div>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #CBD5E1", fontWeight: "bold", outline: "none", cursor: "pointer", background: "#F8FAFC" }}
          >
            {availableYears.map(y => (
              <option key={y} value={y}>Filtrar Ano: {y}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {installmentsToShow.length === 0 ? (
            <div style={{ padding: "16px", color: "#64748B", textAlign: "center", background: "#F1F5F9", borderRadius: "8px" }}>Nenhuma parcela encontrada para este ano.</div>
          ) : installmentsToShow.map(inst => (
             <div key={inst.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: inst.hasBalloon ? "#FEF3C7" : (inst.isPaid ? "#F0FDF4" : "#F8FAFC"), borderRadius: "8px", borderLeft: inst.hasBalloon ? "4px solid #D97706" : (inst.isPaid ? "4px solid #10B981" : "4px solid #F59E0B") }}>
               <div>
                 <div style={{ fontWeight: "bold", color: "#1E293B" }}>
                   {inst.description}
                   {inst.hasBalloon && <span style={{ marginLeft: "8px", fontSize: "12px", background: "#D97706", color: "white", padding: "2px 6px", borderRadius: "4px" }}>INTERMEDIÁRIA</span>}
                   {inst.isPaid && <span style={{ marginLeft: "8px", fontSize: "12px", background: "#10B981", color: "white", padding: "2px 6px", borderRadius: "4px" }}>PAGO</span>}
                 </div>
                 <div style={{ fontSize: "13px", color: "#64748B" }}>Vencimento: {inst.date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric', day: 'numeric', timeZone: 'UTC' })}</div>
               </div>
               <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                 <div style={{ fontWeight: "bold", color: inst.isPaid ? "#10B981" : "#EF4444", fontSize: "18px" }}>
                   {priceBRL(inst.amount)}
                 </div>
                 <button
                  onClick={() => {
                    setEditingTransaction(inst);
                    setEditAmount(inst.amount);
                    setEditDescription(inst.description);
                  }}
                  style={{ padding: "6px 16px", background: "white", border: `1px solid ${inst.hasBalloon ? "#D97706" : (inst.isPaid ? "#10B981" : "#CBD5E1")}`, color: inst.hasBalloon ? "#D97706" : (inst.isPaid ? "#10B981" : "#475569"), borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
                   Editar
                 </button>
               </div>
             </div>
          ))}
        </div>
      </section>

      {/* Modal de Edição */}
      {editingTransaction && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
          <div style={{ background: "white", padding: "32px", borderRadius: "16px", width: "100%", maxWidth: "500px" }}>
            <h2 style={{ margin: "0 0 24px 0", color: "#0F172A" }}>Editar Parcela</h2>
            <form onSubmit={handleEditTransaction}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#334155" }}>Descrição da Parcela</label>
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                />
              </div>
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#334155" }}>Valor Final (R$)</label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                />
                <span style={{ fontSize: "12px", color: "#64748B", display: "block", marginTop: "4px" }}>
                  Dica: Para adicionar um Balão, some o valor do balão ao valor da parcela e mude a descrição.
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button type="button" onClick={() => setEditingTransaction(null)} style={{ padding: "10px 20px", background: "transparent", border: "1px solid #CBD5E1", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
                  Cancelar
                </button>
                <button type="submit" style={{ padding: "10px 20px", background: "#5E17EB", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
                  Salvar Modificação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Crop Modal */}
      {cropModalOpen && (
        <ImageCropModal
          imageToCrop={imageToCrop}
          onCancel={() => {
            setCropModalOpen(false);
            setImageToCrop(null);
            setZoom(1);
          }}
          onSave={async (pixels) => {
            setCroppedAreaPixels(pixels);
            await handleSaveCrop(pixels);
          }}
        />
      )}
    </div>
  );
}
