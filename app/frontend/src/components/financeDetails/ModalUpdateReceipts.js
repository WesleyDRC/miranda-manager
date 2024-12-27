import styles from "./ModalUpdateReceipts.module.css";

import CloseIcon from "../../assets/close-icon.svg";
import uploadIcon from "../../assets/upload-icon.svg";

import axiosRepositoryInstance from "../../repository/AxiosRepository";

import { useFinance } from "../../hooks/useFinance";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export function ModalUpdateReceipts({
  rentMonthId,
  rentId,
  month,
  currentAmount,
  currentReason,
  closeModal,
  modalUpdateReceiptsClass,
}) {
  const [newReceipt, setNewReceipt] = useState(null);
  const { fetchRentReceipts, receipts } = useFinance();

  useEffect(() => {
    fetchRentReceipts(rentMonthId);
  }, []);

  const handleInputPaymentReceipts = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      toast.error("Nenhum arquivo foi selecionado");
      return;
    }

    setNewReceipt(file);
  };

  const addRentReceipt = async (receipt) => {
    const response = await axiosRepositoryInstance.createRentReceipt({
      rentMonthId: rentMonthId,
      receipt,
    });

    fetchRentReceipts(rentMonthId);
    
    toast.success("Comprovante enviado com sucesso!");

    closeModal();
  };

  return (
    <div className={styles.modal} aria-labelledby="modalTitle">
      <div className={`${styles.modalContent} ${modalUpdateReceiptsClass}`}>
        <header className={styles.modalHeader}>
          <h2 className={styles.title} id="modalTitle">
            {month}
          </h2>
          <button onClick={closeModal}>
            <img className={styles.icon} src={CloseIcon} alt="Close Modal Icon" />
          </button>
        </header>

        <main className={styles.modalBody}>
          <section aria-labelledby="receiptsTitle">
            <div className={styles.sectionTitle}>
              <h3 id="receiptsTitle"> Comprovantes </h3>
              <label htmlFor="fileUpload" className={styles.action}>
                <img src={uploadIcon} alt="Upload Receipts Icon" />
                <span> Enviar Comprovante </span>
              </label>
              <input
                id="fileUpload"
                type="file"
                className={styles.inputFile}
                onChange={handleInputPaymentReceipts}
              />
            </div>
            <div className={styles.boxReceipts}>
              {receipts &&
                receipts.map((receipt) => (
                  <div key={receipt.id}>
                    <img
                      src={`data:image/jpeg;base64,${receipt.receipt}`}
                      alt={`Recibo ${receipt.id}`}
                      className={styles.receiptImage}
                    />
                  </div>
                ))}
            </div>
          </section>
        </main>

        <footer className={styles.modalFooter}>
          <button onClick={closeModal} className={`${styles.btn} ${styles.btnCancel}`}>
            Cancelar
          </button>
          <button
            disabled={newReceipt ? false : true}
            onClick={() => addRentReceipt(newReceipt)}
            className={`${styles.btn} ${styles.btnEdit}`}
          >
            Salvar
          </button>
        </footer>
      </div>
    </div>
  );
}
