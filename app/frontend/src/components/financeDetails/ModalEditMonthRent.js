import styles from "./ModalEditMonthRent.module.css";

import ModalEditExpense from "./ModalEditExpense";

import CloseIcon from "../../assets/close-icon.svg";
import alertIcon from "../../assets/alert-icon.svg";
import uploadIcon from "../../assets/upload-icon.svg";
import editIcon from "../../assets/edit-icon.svg";

import { EditPaymentStatus } from "./EditPaymentStatus";

import priceBRL from "../../utils/formatPrice";

import axiosRepositoryInstance from "../../repository/AxiosRepository";

import { useState } from "react";

export default function ModalEditMonthRent({
  rentId = "",
  rentMonthId = "",
  month = "Janeiro",
  paid = false,
  closeModal,
  rentalExpenses = [],
  onRefresh,
  amount = 0
}) {
  const [paymentStatus, setPaymentStatus] = useState(paid);
  const [amountPaid, setAmountPaid] = useState(amount);
  const [showEditPaymentStatus, setShowEditPaymentStatus] = useState(false);
  const [showModalEditExpense, setShowModalEditExpense] = useState(false);
  const [modalClass, setModalClass] = useState(styles.slideInLeft);
  const [modalEditExpenseClass, setModalEditExpenseClass] = useState(styles.slideInLeft);

  const handleToggle = (status) => {
    setPaymentStatus(status);
  };

  console.log(amount)

  const handleAmountPaid = (amount) => {
    console.log(amount)
    setAmountPaid(amount);
  };

  const handleEditPaymentStatus = () => {
    setShowEditPaymentStatus(!showEditPaymentStatus);
    setPaymentStatus(paid);
  };

  const handleShowModalEditExpense = () => {
    setModalClass(styles.slideOutLeft);

    setShowModalEditExpense(true);

    setModalEditExpenseClass(styles.slideInRight)
  };

  const editMonthData = async () => {
    if (
      !paymentStatus !== paid &&
      amountPaid === amount
    ) {
      console.log("Você não editou nenhum campo!");
      return;
    }

    await axiosRepositoryInstance.updateRentMonth({
      rentId: rentId,
      rentMonthId: rentMonthId,
      paid: paymentStatus,
      amountPaid: amountPaid
    });

    onRefresh();
    closeModal();
  };

  const closeModalEditExpense = () => {
    setModalClass(styles.slideInLeft)

    setTimeout(() => {
      setShowModalEditExpense(false);
    }, 300); 

    setModalEditExpenseClass(styles.slideOutRight)
  }
  
  return (
    <>
      <div
        className={styles.modal}
        aria-labelledby="modalTitle"
      >
        <div className={`${styles.modalContent} ${modalClass}`}>
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
                <div
                  onClick={handleEditPaymentStatus}
                  className={styles.action}
                >
                  <img src={editIcon} alt="Edit Payment Icon" />
                  <span> Editar </span>
                </div>
              </div>
              {!showEditPaymentStatus ? (
                <div
                  className={`
                  ${styles.status} ${paid ? styles.paid : styles.pending}`}
                >
                  {!paid && <img src={alertIcon} alt="Alert icon" />}
                  <span> {paid ? "PAGO" : "PENDENTE"} </span>
                </div>
              ) : (
                <EditPaymentStatus
                  paid={paymentStatus}
                  onToggle={handleToggle}
                  onAmountPaid={handleAmountPaid}
                  amount={amountPaid}
                />
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
                <div onClick={handleShowModalEditExpense} className={styles.action}>
                  <img src={editIcon} alt="Edit Expense Icon" />
                  <span> Gastos </span>
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
                    {rentalExpenses.map((expense, index) => (
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
            <button
              onClick={editMonthData}
              className={`${styles.btn} ${styles.btnEdit}`}
            >
              Editar
            </button>
          </footer>
        </div>
      </div>

      {showModalEditExpense && (
        <ModalEditExpense
          rentId={rentId}
          month={month}
          rentalExpenses={rentalExpenses}
          closeModal={closeModalEditExpense}
          onRefresh={onRefresh}
          modalEditExpenseClass={modalEditExpenseClass}
        />
      )}
    </>
  );
}
