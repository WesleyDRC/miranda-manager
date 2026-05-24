import styles from "./ModalEditMonthRent.module.css";

import ModalAddExpense from "./ModalAddExpense";
import { ExpenseEditModal } from "./ExpenseEditModal";
import { ModalUpdateReceipts } from "./ModalUpdateReceipts";
import { ConfirmModal } from "../modals/ConfirmModal";
import { ModalAddPayment } from "./ModalAddPayment";

import CloseIcon from "../../assets/close-icon.svg";
import alertIcon from "../../assets/alert-icon.svg";
import uploadIcon from "../../assets/upload-icon.svg";
import editIcon from "../../assets/edit-icon.svg";
import editIconWhite from "../../assets/edit-icon-white.svg";
import trashIcon from "../../assets/trash-icon.svg";

import priceBRL from "../../utils/formatPrice";

import axiosRepositoryInstance from "../../repository/AxiosRepository";

import { useFinance } from "../../hooks/useFinance";

import { useState } from "react";

import { toast } from "react-toastify";

export default function ModalEditMonthRent({
  rentId = "",
  rentMonthId = "",
  month = "Janeiro",
  paid = false,
  closeModal,
  amount = 0,
}) {
  const { rentData, fetchRentData, receipts, fetchFinanceData } = useFinance();

  const [expenseId, setExpenseId] = useState("");
  const [showModalAddExpense, setShowModalAddExpense] = useState(false);
  const [showExpenseEditModal, setShowExpenseEditModal] = useState(false);
  const [showModalUpdateReceipts, setShowModalUpdateReceipts] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showModalAddPayment, setShowModalAddPayment] = useState(false);
  const [showConfirmPaymentModal, setShowConfirmPaymentModal] = useState(false);
  const [paymentIdToDelete, setPaymentIdToDelete] = useState("");
  const [modalEditMonthClass, setModalEditMonthClass] = useState(styles.slideInLeft);
  const [modalAddExpenseClass, setModalAddExpenseClass] = useState(styles.slideInLeft);
  const [expenseEditModalClass, setExpenseEditModalClass] = useState(styles.slideInLeft);
  const [modalUpdateReceiptsClass, setModalUpdateReceiptsClass] = useState(styles.slideInLeft);
  const [modalAddPaymentClass, setModalAddPaymentClass] = useState(styles.slideInLeft);
  const [confirmModalClass, setConfirmModalClass] = useState("");

  const [expenseData, setExpenseData] = useState({
    id: "",
    amount: 0,
    reason: "",
  });

  // Remove outdated toggle handlers

  const handleShowModalAddExpense = () => {
    setModalEditMonthClass(styles.slideOutLeft);

    setShowModalAddExpense(true);

    setModalAddExpenseClass(styles.slideInRight);
  };

  const editMonthData = async () => {
    // Only used to close modal now, or other meta-edits if added later
    closeModal();
  };

  const rentMonthObj = rentData.months.find((month) => month.id === rentMonthId);
  const expenses = rentMonthObj ? rentMonthObj.expenses : [];
  const payments = rentMonthObj && rentMonthObj.payments ? rentMonthObj.payments : [];

  const closeModalAddExpense = () => {
    setModalEditMonthClass(styles.slideInLeft);

    setTimeout(() => {
      setShowModalAddExpense(false);
    }, 300);

    setModalAddExpenseClass(styles.slideOutRight);
  };

  const handleExpenseEdit = async ({ id, expenseReason, expenseAmount }) => {
    setExpenseData({
      id: id,
      amount: expenseAmount,
      reason: expenseReason,
    });

    setModalEditMonthClass(styles.slideOutLeft);
    setShowExpenseEditModal(true);
    setExpenseEditModalClass(styles.slideInRight);
  };

  const closeExpenseEditModal = async () => {
    setModalEditMonthClass(styles.slideInLeft);

    setTimeout(() => {
      setShowExpenseEditModal(false);
    }, 300);

    setExpenseEditModalClass(styles.slideOutRight);
  };

  const handleDeleteExpense = async (id) => {
    setExpenseId(id);
    setShowConfirmModal(true);
  };

  const confirmDeleteExpense = async () => {
    const response = await axiosRepositoryInstance.deleteExpense({ id: expenseId });

    if (response.status !== 200) {
      toast.error(response.data.message);
      return;
    }

    if (response.status === 200) {
      toast.success("Despesa deletada com sucesso!");
    }

    await fetchRentData(rentId);

    hideConfirmModal();
  };

  const cancelDeleteExpense = () => {
    hideConfirmModal();
  };

  const hideConfirmModal = () => {
    setConfirmModalClass("hide");

    setTimeout(() => {
      setShowConfirmModal(false);
      setConfirmModalClass("");
    }, 300);
  };

  const handleShowModalUpdateReceipts = () => {
    setModalEditMonthClass(styles.slideOutLeft);

    setShowModalUpdateReceipts(true);

    setModalUpdateReceiptsClass(styles.slideInRight);
  };

  const closeModalUpdateReceipts = async () => {
    setModalEditMonthClass(styles.slideInLeft);

    setTimeout(() => {
      setShowModalUpdateReceipts(false);
    }, 300);

    setModalUpdateReceiptsClass(styles.slideOutRight);
  };

  const handleShowModalAddPayment = () => {
    setModalEditMonthClass(styles.slideOutLeft);
    setShowModalAddPayment(true);
    setModalAddPaymentClass(styles.slideInRight);
  };

  const closeModalAddPayment = () => {
    setModalEditMonthClass(styles.slideInLeft);
    setTimeout(() => {
      setShowModalAddPayment(false);
    }, 300);
    setModalAddPaymentClass(styles.slideOutRight);
  };

  const handleDeletePayment = async (id) => {
    setPaymentIdToDelete(id);
    setShowConfirmPaymentModal(true);
  };

  const confirmDeletePayment = async () => {
    const response = await axiosRepositoryInstance.deleteRentPayment({ id: paymentIdToDelete });

    if (response.status !== 200) {
      toast.error(response.data?.message || "Erro ao deletar");
      return;
    }

    toast.success("Pagamento deletado com sucesso!");
    await fetchRentData(rentId);
    
    const financeId = window.location.pathname.split("/")[2];
    if (financeId) {
      fetchFinanceData(financeId); 
    }

    hideConfirmPaymentModal();
  };

  const hideConfirmPaymentModal = () => {
    setConfirmModalClass("hide");
    setTimeout(() => {
      setShowConfirmPaymentModal(false);
      setConfirmModalClass("");
    }, 300);
  };

  return (
    <>
      <div className={styles.modal} aria-labelledby="modalTitle">
        <div className={`${styles.modalContent} ${modalEditMonthClass}`}>
          <header className={styles.modalHeader}>
            <h2 className={styles.title} id="modalTitle">
              {month}
            </h2>
            <button onClick={closeModal}>
              <img className={styles.icon} src={CloseIcon} alt="Close Modal Icon" />
            </button>
          </header>

          <main className={styles.modalBody}>
            <section aria-labelledby="statusTitle">
              <div className={styles.sectionTitle}>
                <h3 id="statusTitle"> Status do pagamento</h3>
              </div>
              <div
                className={`
                ${styles.status} ${paid ? styles.paid : styles.pending}`}
              >
                {!paid && <img src={alertIcon} alt="Alert icon" />}
                <span> {paid ? "PAGO" : "PENDENTE"} </span>
              </div>
            </section>

            <section aria-labelledby="paymentsTitle">
              <div className={styles.sectionTitle}>
                <h3 id="paymentsTitle"> Pagamentos Realizados </h3>
                <div onClick={handleShowModalAddPayment} className={styles.action}>
                  <img src={uploadIcon} alt="Add Payment Icon" />
                  <span> Adicionar Pagamento </span>
                </div>
              </div>

              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Valor</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments &&
                      payments.map((payment, index) => (
                        <tr key={index}>
                          <td>{new Date(payment.paymentDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                          <td>{priceBRL(parseFloat(payment.amount))}</td>
                          <td className={styles.expenseButtons}>
                            <button
                              onClick={() => handleDeletePayment(payment.id)}
                              className={`${styles.btnExpense} ${styles.delete}`}
                            >
                              <img src={trashIcon} alt="Trash Icon" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    {payments.length === 0 && (
                      <tr>
                        <td colSpan={3} style={{ textAlign: "center", color: "var(--text-muted)", padding: "16px" }}>
                          Nenhum pagamento registrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="receiptsTitle">
              <div className={styles.sectionTitle}>
                <h3 id="receiptsTitle"> Comprovantes </h3>
                <div onClick={handleShowModalUpdateReceipts} className={styles.action}>
                  <img src={uploadIcon} alt="Upload Receipts Icon" />
                  <span> Enviar Comprovantes </span>
                </div>
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

            <section aria-labelledby="spendingTitle">
              <div className={styles.sectionTitle}>
                <h3 id="spendingTitle"> Gastos do mês </h3>
                <div onClick={handleShowModalAddExpense} className={styles.action}>
                  <img src={editIcon} alt="Edit Expense Icon" />
                  <span> Gastos </span>
                </div>
              </div>

              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Valor</th>
                      <th colSpan={2}>Motivo</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses &&
                      expenses.map((expense, index) => (
                        <tr key={index}>
                          <td>{priceBRL(parseFloat(expense.amount))}</td>
                          <td colSpan={2}>{expense.reason}</td>
                          <td className={styles.expenseButtons}>
                            <button
                              onClick={() =>
                                handleExpenseEdit({
                                  id: expense.id,
                                  expenseAmount: expense.amount,
                                  expenseReason: expense.reason,
                                })
                              }
                              className={`${styles.btnExpense} ${styles.edit}`}
                            >
                              <img src={editIconWhite} alt="Edit Icon White" />
                            </button>

                            <button
                              onClick={() => handleDeleteExpense(expense.id)}
                              className={`${styles.btnExpense} ${styles.delete}`}
                            >
                              <img src={trashIcon} alt="Trash Icon" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          </main>

          <footer className={styles.modalFooter}>
            <button onClick={closeModal} className={`${styles.btn} ${styles.btnCancel}`}>
              Fechar
            </button>
          </footer>
        </div>
      </div>

      {showModalAddExpense && (
        <ModalAddExpense
          rentId={rentId}
          rentMonthId={rentMonthId}
          expenses={expenses}
          month={month}
          rentalExpenses={rentData.expenses}
          closeModal={closeModalAddExpense}
          modalAddExpenseClass={modalAddExpenseClass}
        />
      )}

      {showExpenseEditModal && (
        <ExpenseEditModal
          expenseId={expenseData.id}
          rentId={rentId}
          month={month}
          expenseEditModalClass={expenseEditModalClass}
          closeModal={closeExpenseEditModal}
          currentAmount={expenseData.amount}
          currentReason={expenseData.reason}
        />
      )}

      {showConfirmModal && (
        <ConfirmModal
          title="Excluir gasto"
          item="o gasto"
          onConfirm={confirmDeleteExpense}
          onCancel={cancelDeleteExpense}
          confirmModalClass={confirmModalClass}
        />
      )}

      {showModalUpdateReceipts && (
        <ModalUpdateReceipts
          rentMonthId={rentMonthId}
          rentId={rentId}
          closeModal={closeModalUpdateReceipts}
          modalUpdateReceiptsClass={modalUpdateReceiptsClass}
        />
      )}

      {showModalAddPayment && (
        <ModalAddPayment
          rentId={rentId}
          rentMonthId={rentMonthId}
          closeModal={closeModalAddPayment}
          modalAddPaymentClass={modalAddPaymentClass}
        />
      )}

      {showConfirmPaymentModal && (
        <ConfirmModal
          title="Excluir pagamento"
          item="o pagamento"
          onConfirm={confirmDeletePayment}
          onCancel={hideConfirmPaymentModal}
          confirmModalClass={confirmModalClass}
        />
      )}
    </>
  );
}
