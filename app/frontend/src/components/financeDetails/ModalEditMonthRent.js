import styles from "./ModalEditMonthRent.module.css";

import CloseIcon from "../../assets/close-icon.svg";
import alertIcon from "../../assets/alert-icon.svg";
import uploadIcon from "../../assets/upload-icon.svg";
import editIcon from "../../assets/edit-icon.svg";

import { EditPaymentStatus } from "./EditPaymentStatus";

import priceBRL from "../../utils/formatPrice";
import { useState } from "react";

export default function ModalEditMonthRent({
  month = "Janeiro",
  paid = false,
  closeModal,
  rentalExpeneses = [],
}) {
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [showEditPaymentStatus, setShowEditPaymentStatus] = useState(false);

  const handleToggle = (status) => {
    setPaymentStatus(status);
  };

  const handleEditPaymentStatus = () => {
    setShowEditPaymentStatus(!showEditPaymentStatus);
  };

  return (
    <div className={styles.modal} aria-labelledby="modalTitle">
      <div className={styles.modalContent}>
        <header className={styles.modalHeader}>
          <h2 className={styles.title} id="modalTitle">
            {month}
          </h2>
          <button onClick={closeModal}>
            <img
              className={styles.icon}
              src={CloseIcon}
              alt="Close Modal Icon"
            />
          </button>
        </header>

        <main className={styles.modalBody}>
          <section aria-labelledby="statusTitle">
            <div className={styles.sectionTitle}>
              <h3 id="statusTitle"> Status do pagamento</h3>
              <div onClick={handleEditPaymentStatus} className={styles.action}>
                <img src={editIcon} alt="Edit Payment Icon" />
                <span> Editar </span>
              </div>
            </div>
            {!showEditPaymentStatus ? (
              <div
                className={`
                  ${styles.status} ${ paid ? styles.paid : styles.pending
                }`}
              >
                <img src={alertIcon} alt="Alert icon" />
                <span> Pendente </span>
              </div>
            ) : (
              <EditPaymentStatus paid={paymentStatus} onToggle={handleToggle} />
            )}
          </section>

          <section aria-labelledby="receiptsTitle">
            <div className={styles.sectionTitle}>
              <h3 id="receiptsTitle"> Comprovantes </h3>
              <div className={styles.action}>
                <img src={uploadIcon} alt="Upload Receipts Icon" />
                <span> Adicionar comprovantes </span>
              </div>
            </div>
            <div className={styles.boxReceipts}></div>
          </section>

          <section aria-labelledby="spendingTitle">
            <div className={styles.sectionTitle}>
              <h3 id="spendingTitle"> Gastos do mês </h3>
              <div className={styles.action}>
                <img src={editIcon} alt="Edit Payment Icon" />
                <span> Editar </span>
              </div>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Valor</th>
                    <th>Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {rentalExpeneses.map((expense, index) => (
                    <tr key={index}>
                      <td>{priceBRL(parseFloat(expense.amount))}</td>
                      <td>{expense.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        <footer className={styles.modalFooter}>
          <button
            onClick={closeModal}
            className={`${styles.btn} ${styles.btnCancel}`}
          >
            Cancelar
          </button>
          <button className={`${styles.btn} ${styles.btnEdit}`}>Editar</button>
        </footer>
      </div>
    </div>
  );
}
