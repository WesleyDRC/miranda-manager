import React, { useEffect, useState } from "react";
import styles from "./ModalUpdateReceipts.module.css";
import CloseIcon from "../../assets/close-icon.svg";
import axiosRepositoryInstance from "../../repository/AxiosRepository";
import { useFinance } from "../../hooks/useFinance";
import { toast } from "react-toastify";
import {
  FaCloudUploadAlt,
  FaTimes,
  FaSearchPlus,
  FaRegFileImage,
  FaTrashAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

export function ModalUpdateReceipts({
  rentMonthId,
  rentId,
  month,
  closeModal,
  modalUpdateReceiptsClass,
}) {
  const [newReceipt, setNewReceipt] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { fetchRentReceipts, receipts } = useFinance();

  useEffect(() => {
    fetchRentReceipts(rentMonthId);
    // eslint-disable-next-line
  }, []);

  const handleInputPaymentReceipts = (e) => {
    const file = e.target.files[0];

    if (!file) {
      toast.error("Nenhum arquivo foi selecionado");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Selecione apenas arquivos de imagem (PNG, JPEG, JPG)");
      return;
    }

    setNewReceipt(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Selecione apenas arquivos de imagem (PNG, JPEG, JPG)");
        return;
      }
      setNewReceipt(file);
    }
  };

  const addRentReceipt = async (receiptFile) => {
    if (isUploading) return;
    setIsUploading(true);
    try {
      const response = await axiosRepositoryInstance.createRentReceipt({
        rentMonthId: rentMonthId,
        receipt: receiptFile,
      });

      if (response.status !== 200) {
        toast.error(response.data?.message || "Erro ao fazer upload do comprovante");
        return;
      }

      await fetchRentReceipts(rentMonthId);
      toast.success("Comprovante enviado com sucesso!");
      setNewReceipt(null);
    } catch (err) {
      console.error(err);
      toast.error("Erro no upload do arquivo.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteReceipt = async (receiptId, e) => {
    e.stopPropagation();
    if (!window.confirm("Deseja realmente excluir este comprovante?")) {
      return;
    }

    try {
      const response = await axiosRepositoryInstance.deleteRentReceipt({ id: receiptId });
      if (response.status === 200 || response.status === 204) {
        toast.success("Comprovante excluído com sucesso!");
        await fetchRentReceipts(rentMonthId);
      } else {
        toast.error("Erro ao excluir o comprovante.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir comprovante.");
    }
  };

  const handlePrevImage = () => {
    if (receipts && receipts.length > 0) {
      setLightboxIndex((prev) => (prev === 0 ? receipts.length - 1 : prev - 1));
    }
  };

  const handleNextImage = () => {
    if (receipts && receipts.length > 0) {
      setLightboxIndex((prev) => (prev === receipts.length - 1 ? 0 : prev + 1));
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "ArrowRight") handleNextImage();
      if (e.key === "Escape") setLightboxIndex(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line
  }, [lightboxIndex, receipts]);

  return (
    <>
      <div className={styles.modal} aria-labelledby="modalTitle">
        <div className={`${styles.modalContent} ${modalUpdateReceiptsClass}`}>
          <header className={styles.modalHeader}>
            <h2 className={styles.title} id="modalTitle">
              Comprovantes — {month}
            </h2>
            <button onClick={closeModal} className={styles.btnCloseHeader}>
              <img className={styles.icon} src={CloseIcon} alt="Close Modal Icon" />
            </button>
          </header>

          <main className={styles.modalBody}>
            {/* New File Selector Dropzone */}
            <section className={styles.uploadSection}>
              <h4>Enviar Novo Comprovante</h4>

              {!newReceipt ? (
                <label
                  htmlFor="fileUpload"
                  className={`${styles.dropzone} ${isDragActive ? styles.dropzoneActive : ""}`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <FaCloudUploadAlt className={styles.dropzoneIcon} />
                  <div className={styles.dropzoneText}>
                    <strong>Clique ou arraste</strong> o arquivo aqui
                    <span>Formatos suportados: PNG, JPG, JPEG</span>
                  </div>
                  <input
                    id="fileUpload"
                    type="file"
                    accept="image/*"
                    className={styles.inputFile}
                    onChange={handleInputPaymentReceipts}
                  />
                </label>
              ) : (
                <div className={styles.previewCard}>
                  <div className={styles.previewThumbWrapper}>
                    <img
                      src={URL.createObjectURL(newReceipt)}
                      alt="Thumbnail Preview"
                      className={styles.previewThumb}
                    />
                  </div>
                  <div className={styles.previewInfo}>
                    <FaRegFileImage className={styles.fileIcon} />
                    <div className={styles.fileDetails}>
                      <strong>{newReceipt.name}</strong>
                      <span>{(newReceipt.size / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>
                  <div className={styles.previewActions}>
                    <button
                      disabled={isUploading}
                      onClick={() => addRentReceipt(newReceipt)}
                      className={styles.btnSendPreview}
                    >
                      {isUploading ? "Enviando..." : "Enviar"}
                    </button>
                    <button
                      disabled={isUploading}
                      onClick={() => setNewReceipt(null)}
                      className={styles.btnRemovePreview}
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Existing Receipts Grid */}
            <section className={styles.receiptsListSection}>
              <h4>Comprovantes Salvos ({receipts ? receipts.length : 0})</h4>
              {receipts && receipts.length > 0 ? (
                <div className={styles.boxReceiptsGrid}>
                  {receipts.map((receipt, index) => (
                    <div
                      key={receipt.id}
                      className={styles.receiptCard}
                      onClick={() => setLightboxIndex(index)}
                    >
                      <img
                        src={`data:image/jpeg;base64,${receipt.receipt}`}
                        alt={`Recibo ${receipt.id}`}
                        className={styles.receiptImage}
                      />
                      <div className={styles.receiptHoverOverlay}>
                        <FaSearchPlus />
                        <span>Ver Ampliado</span>
                      </div>
                      <button
                        type="button"
                        className={styles.btnDeleteReceipt}
                        onClick={(e) => handleDeleteReceipt(receipt.id, e)}
                        title="Excluir comprovante"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noReceiptsBox}>
                  <p>Nenhum comprovante foi enviado para este mês ainda.</p>
                </div>
              )}
            </section>
          </main>

          <footer className={styles.modalFooter}>
            <button onClick={closeModal} className={`${styles.btn} ${styles.btnFinish}`}>
              Concluir
            </button>
          </footer>
        </div>
      </div>

      {/* Lightbox full-screen overlay */}
      {lightboxIndex !== null && receipts && receipts[lightboxIndex] && (
        <div className={styles.lightboxOverlay} onClick={() => setLightboxIndex(null)}>
          <button
            className={`${styles.btnNavLightbox} ${styles.btnNavLeft}`}
            onClick={(e) => {
              e.stopPropagation();
              handlePrevImage();
            }}
            title="Anterior"
          >
            <FaChevronLeft />
          </button>

          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <img
              src={`data:image/jpeg;base64,${receipts[lightboxIndex].receipt}`}
              alt={`Receipt Lightbox ${lightboxIndex + 1}`}
            />
            <div className={styles.lightboxCounter}>
              {lightboxIndex + 1} / {receipts.length}
            </div>
            <button className={styles.btnCloseLightbox} onClick={() => setLightboxIndex(null)}>
              <FaTimes />
            </button>
          </div>

          <button
            className={`${styles.btnNavLightbox} ${styles.btnNavRight}`}
            onClick={(e) => {
              e.stopPropagation();
              handleNextImage();
            }}
            title="Próximo"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </>
  );
}
