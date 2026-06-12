import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./VehicleDetail.module.css";
import priceBRL from "../utils/formatPrice";
import AxiosRepository from "../repository/AxiosRepository";
import { toast } from "react-toastify";
import { FiTrendingUp, FiArrowLeft, FiEdit2 } from "react-icons/fi";
import getCroppedImg from "../utils/cropImage";
import { PatrimonyHeader } from "../components/patrimony/PatrimonyHeader";
import { ImageUploadCard } from "../components/patrimony/ImageUploadCard";
import { ImageCropModal } from "../components/patrimony/ImageCropModal";
import { EquityProgressBar } from "../components/patrimony/EquityProgressBar";
import { EditableDataRow } from "../components/patrimony/EditableDataRow";
import { ExpenseCard } from "../components/patrimony/ExpenseCard";
import { api } from "../services/api";

export function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  // States for Image Crop
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [currentCropField, setCurrentCropField] = useState("");

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const response = await AxiosRepository.getPatrimonyById({ id });
      setVehicle(response.data.patrimony);
    } catch (error) {
      toast.error("Erro ao carregar os dados do veículo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  if (loading || !vehicle) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <div style={{ width: "40px", height: "40px", border: "4px solid #f3f3f3", borderTop: "4px solid #6366f1", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const getRemainingInstallments = (details) => {
    if (!details || !details.endDate) return 0;
    const end = new Date(details.endDate);
    const now = new Date();
    const diff = (end.getUTCFullYear() - now.getFullYear()) * 12 + (end.getUTCMonth() - now.getMonth());
    return diff > 0 ? diff : 0;
  };

  const equityPercent = vehicle.isFinanced
    ? (((vehicle.marketValue || 0) - ((vehicle.financingDetails?.installmentValue || 0) * getRemainingInstallments(vehicle.financingDetails))) / vehicle.marketValue) * 100 
    : 0;

  const handleUpdateField = async (field, value, isNested = true, isFinancing = false) => {
    try {
      let updates = {};
      if (isFinancing) {
        updates = { financingDetails: { ...vehicle.financingDetails, [field]: value } };
      } else if (isNested) {
        updates = { vehicleDetails: { ...vehicle.vehicleDetails, [field]: value } };
      } else {
        updates = { [field]: value };
      }
      
      await AxiosRepository.updatePatrimony(id, updates);
      toast.success("Dado atualizado!");
      fetchVehicle();
    } catch (error) {
      toast.error("Erro ao atualizar o dado.");
    }
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      toast.info("Fazendo upload...");
      const response = await AxiosRepository.uploadFile(file);
      const fullUrl = `${api.defaults.baseURL || "http://localhost:3333"}${response.data.url}`;
      await handleUpdateField(field, fullUrl, true);
    } catch (error) {
      toast.error("Erro no upload.");
    }
  };

  const handleSaveCrop = async () => {
    try {
      const croppedBlob = await getCroppedImg(imageToCrop, croppedAreaPixels);
      const file = new File([croppedBlob], "cropped.jpg", { type: "image/jpeg" });
      const response = await AxiosRepository.uploadFile(file);
      const fullUrl = `${api.defaults.baseURL || "http://localhost:3333"}${response.data.url}`;
      await handleUpdateField(currentCropField, fullUrl, true);
      setCropModalOpen(false);
      setImageToCrop(null);
      setZoom(1);
    } catch (e) {
      toast.error("Erro ao salvar imagem.");
    }
  };

  const toggleIpvaStatus = async () => {
    const isPaid = vehicle.vehicleDetails?.ipvaPaid;
    await handleUpdateField("ipvaPaid", !isPaid, true);
  };

  return (
    <div className={styles.container}>
      <PatrimonyHeader 
        title={vehicle.name} 
        onBack={() => navigate("/patrimony")}
        rightAction={<button className={styles.sellBtn} onClick={async () => {
          if(window.confirm("Tem certeza que deseja deletar este veículo permanentemente?")) {
            try {
              await AxiosRepository.deletePatrimony({ id: vehicle.id });
              toast.success("Veículo deletado com sucesso!");
              navigate("/patrimony");
            } catch (err) {
              toast.error("Erro ao deletar veículo.");
            }
          }
        }}>Deletar Veículo</button>}
      >
        <span className={styles.badge}>Placa: {vehicle.vehicleDetails?.plate || "Não informada"}</span>
        <span className={styles.badge}>Ano: {vehicle.vehicleDetails?.year || "Não informado"}</span>
      </PatrimonyHeader>

      <div className={styles.grid}>
        <div>
          <ImageUploadCard 
            imageUrl={vehicle.vehicleDetails?.imageUrl}
            onFileSelect={(file) => {
              if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.addEventListener("load", () => {
                  setImageToCrop(reader.result);
                  setCurrentCropField("imageUrl");
                  setCropModalOpen(true);
                });
                reader.readAsDataURL(file);
              }
            }}
          />

          {vehicle.isFinanced && (
            <EquityProgressBar 
              percent={equityPercent} 
            />
          )}

          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>Detalhes do Veículo</h3>
            <EditableDataRow label="Placa" initialValue={vehicle.vehicleDetails?.plate} onSave={(val) => handleUpdateField("plate", val, true)} />
            <EditableDataRow label="Ano Modelo" initialValue={vehicle.vehicleDetails?.year} onSave={(val) => handleUpdateField("year", val, true)} />
            <EditableDataRow label="Valor de Mercado (FIPE)" initialValue={vehicle.marketValue} isCurrency={true} onSave={(val) => handleUpdateField("marketValue", val, false)} />
          </div>
        </div>

        <div>
          <div className={styles.card}>
            <h3 className={styles.sectionTitle}>Obrigações e Despesas</h3>
            
            <ExpenseCard 
              title="IPVA"
              subtitle="Imposto Anual"
              status={vehicle.vehicleDetails?.ipvaPaid ? 'PAID' : 'PENDING'}
              onToggleStatus={toggleIpvaStatus}
              value={vehicle.vehicleDetails?.ipvaValue}
              onSaveValue={(val) => handleUpdateField("ipvaValue", val, true)}
              attachmentUrl={vehicle.vehicleDetails?.ipvaReceiptUrl}
              onFileSelect={(file) => handleFileUpload({ target: { files: [file] } }, "ipvaReceiptUrl")}
            />

            <ExpenseCard 
              title="Seguro Auto"
              subtitle="Apólice / Franquia"
              value={vehicle.vehicleDetails?.insuranceValue}
              onSaveValue={(val) => handleUpdateField("insuranceValue", val, true)}
              attachmentUrl={vehicle.vehicleDetails?.insurancePolicyUrl}
              onFileSelect={(file) => handleFileUpload({ target: { files: [file] } }, "insurancePolicyUrl")}
            />
            
            {vehicle.isFinanced && (
              <div style={{ marginTop: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h4 style={{ color: "#0f172a", margin: 0 }}>Dados do Financiamento</h4>
                  <button onClick={() => {
                    if(window.confirm("Tem certeza que deseja remover o financiamento deste veículo? Isso apagará todas as parcelas pendentes.")) {
                      handleUpdateField("isFinanced", false, false, false);
                    }
                  }} style={{ background: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA", padding: "4px 8px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>
                    Remover Financiamento
                  </button>
                </div>
                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <EditableDataRow label="Parcela Mensal" initialValue={vehicle.financingDetails?.installmentValue} isCurrency={true} onSave={(val) => handleUpdateField("installmentValue", val, true, true)} />
                  <EditableDataRow label="Data de Início" initialValue={vehicle.financingDetails?.startDate ? new Date(vehicle.financingDetails.startDate).toISOString().slice(0,7) : ""} isDate onSave={(val) => handleUpdateField("startDate", val + "-01T00:00:00.000Z", true, true)} />
                  <EditableDataRow label="Data de Fim" initialValue={vehicle.financingDetails?.endDate ? new Date(vehicle.financingDetails.endDate).toISOString().slice(0,7) : ""} isDate onSave={(val) => handleUpdateField("endDate", val + "-01T00:00:00.000Z", true, true)} />
                  <EditableDataRow label="Dia do Vencimento" initialValue={vehicle.financingDetails?.dueDateDay} onSave={(val) => handleUpdateField("dueDateDay", val, true, true)} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
            await handleSaveCrop();
          }}
        />
      )}
    </div>
  );
}
