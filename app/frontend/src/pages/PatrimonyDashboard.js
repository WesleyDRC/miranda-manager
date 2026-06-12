import { useEffect, useState } from "react";
import axiosRepositoryInstance from "../repository/AxiosRepository";
import styles from "./PatrimonyDashboard.module.css";
import priceBRL from "../utils/formatPrice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function PatrimonyDashboard() {
  const navigate = useNavigate();
  const [patrimonies, setPatrimonies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [type, setType] = useState("VEHICLE");
  const [marketValue, setMarketValue] = useState("");
  const [isFinanced, setIsFinanced] = useState(false);
  const [installmentValue, setInstallmentValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dueDateDay, setDueDateDay] = useState("");

  const fetchPatrimonies = async () => {
    try {
      const response = await axiosRepositoryInstance.getPatrimonies();
      setPatrimonies(response.data.patrimonies || []);
    } catch (err) {
      toast.error("Erro ao carregar patrimônios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatrimonies();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name || !marketValue) {
      toast.warning("Preencha o nome e o valor de mercado.");
      return;
    }

    if (isFinanced && (!installmentValue || !startDate || !endDate || !dueDateDay)) {
      toast.warning("Preencha todos os dados do financiamento.");
      return;
    }

    try {
      const financingDetails = isFinanced ? {
        installmentValue: Number(installmentValue),
        startDate: startDate + "-01T00:00:00.000Z",
        endDate: endDate + "-01T00:00:00.000Z",
        dueDateDay: Number(dueDateDay)
      } : undefined;

      await axiosRepositoryInstance.createPatrimony({
        name,
        type,
        marketValue: Number(marketValue),
        isFinanced,
        financingDetails
      });

      toast.success("Bem cadastrado com sucesso!");
      setName("");
      setMarketValue("");
      setIsFinanced(false);
      fetchPatrimonies();
    } catch (err) {
      toast.error("Erro ao cadastrar patrimônio.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar este bem permanentemente?")) {
      try {
        await axiosRepositoryInstance.deletePatrimony({ id });
        toast.success("Bem deletado com sucesso!");
        fetchPatrimonies();
      } catch (err) {
        toast.error("Erro ao deletar o bem.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Meu Patrimônio</h1>
        <p className={styles.subtitle}>Gerencie seus bens (Carros, Imóveis) e financiamentos.</p>
      </header>

      {/* Form */}
      <section className={styles.chartSection} style={{ marginBottom: "24px" }}>
        <h3>Adicionar Bem</h3>
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 2 }}>
              <label style={{ fontSize: "14px", fontWeight: 600 }}>Nome do Bem</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Apartamento Centro" style={{ padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
              <label style={{ fontSize: "14px", fontWeight: 600 }}>Tipo</label>
              <select value={type} onChange={(e) => setType(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                <option value="REAL_ESTATE">Imóvel</option>
                <option value="VEHICLE">Veículo</option>
                <option value="OTHER">Outro</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
              <label style={{ fontSize: "14px", fontWeight: 600 }}>Valor de Venda (R$)</label>
              <input type="number" step="0.01" value={marketValue} onChange={(e) => setMarketValue(e.target.value)} placeholder="0.00" style={{ padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0" }} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input type="checkbox" checked={isFinanced} onChange={(e) => setIsFinanced(e.target.checked)} id="isFin" style={{ width: "18px", height: "18px" }} />
            <label htmlFor="isFin" style={{ fontSize: "14px", fontWeight: 600 }}>Este bem é financiado?</label>
          </div>

          {isFinanced && (
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", padding: "16px", background: "#F8FAFC", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                <label style={{ fontSize: "14px", fontWeight: 600 }}>Valor da Parcela (R$)</label>
                <input type="number" step="0.01" value={installmentValue} onChange={(e) => setInstallmentValue(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #CBD5E1" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                <label style={{ fontSize: "14px", fontWeight: 600 }}>Mês/Ano de Início</label>
                <input type="month" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #CBD5E1" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                <label style={{ fontSize: "14px", fontWeight: 600 }}>Mês/Ano de Fim</label>
                <input type="month" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #CBD5E1" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                <label style={{ fontSize: "14px", fontWeight: 600 }}>Dia do Vencimento</label>
                <input type="number" min="1" max="31" value={dueDateDay} onChange={(e) => setDueDateDay(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #CBD5E1" }} />
              </div>
            </div>
          )}

          <button type="submit" style={{ padding: "12px 24px", borderRadius: "8px", background: "#5E17EB", color: "white", border: "none", fontWeight: 600, cursor: "pointer", alignSelf: "flex-start" }}>
            Adicionar Bem
          </button>
        </form>
      </section>

      {/* List */}
      <div className={styles.kpiGrid}>
        {loading ? (
          <div className={styles.loading}>Carregando...</div>
        ) : patrimonies.length === 0 ? (
          <div style={{ color: "#64748B" }}>Nenhum bem cadastrado.</div>
        ) : (
          patrimonies.map(pat => (
            <div key={pat.id} className={styles.kpiCard} style={{ borderLeftColor: pat.isFinanced ? "#F59E0B" : "#10B981", position: "relative" }}>
              <button
                onClick={() => handleDelete(pat.id)}
                style={{ position: "absolute", top: "12px", right: "12px", background: "#FEE2E2", color: "#DC2626", border: "none", borderRadius: "4px", padding: "4px 8px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>
                Deletar
              </button>
              <span className={styles.kpiLabel}>{pat.name} ({pat.type === "VEHICLE" ? "Veículo" : pat.type === "REAL_ESTATE" ? "Imóvel" : "Outro"})</span>
              <span className={styles.kpiValue}>{priceBRL(pat.marketValue)}</span>
              {pat.isFinanced && (
                <div style={{ fontSize: "13px", color: "#64748B", marginTop: "8px" }}>
                  <strong>Financiamento:</strong> {priceBRL(pat.financingDetails?.installmentValue)} / mês
                  <div style={{ marginTop: "4px" }}>
                    Período: {new Date(pat.financingDetails?.startDate).toLocaleDateString('pt-BR', {month: 'short', year: 'numeric', timeZone: 'UTC'})} até {new Date(pat.financingDetails?.endDate).toLocaleDateString('pt-BR', {month: 'short', year: 'numeric', timeZone: 'UTC'})}
                  </div>
                </div>
              )}
              <button
                onClick={() => {
                  if (pat.type === "VEHICLE") {
                    navigate(`/patrimony/vehicle/${pat.id}`);
                  } else {
                    navigate(`/patrimony/${pat.id}`);
                  }
                }}
                style={{ width: "100%", marginTop: "16px", padding: "8px", borderRadius: "6px", background: "#F1F5F9", color: "#334155", border: "1px solid #E2E8F0", cursor: "pointer", fontWeight: "bold" }}>
                Ver Detalhes
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
