import styles from "./ModalEditMonthRent.module.css";

import ModalAddExpense from "./ModalAddExpense";
import { ExpenseEditModal } from "./ExpenseEditModal";
import { ConfirmModal } from "../modals/ConfirmModal";

import CloseIcon from "../../assets/close-icon.svg";
import alertIcon from "../../assets/alert-icon.svg";
import uploadIcon from "../../assets/upload-icon.svg";
import editIcon from "../../assets/edit-icon.svg";
import editIconWhite from "../../assets/edit-icon-white.svg";
import trashIcon from "../../assets/trash-icon.svg";

import { EditPaymentStatus } from "./EditPaymentStatus";

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
  const { rentData, fetchRentData } = useFinance();

  const [expenseId, setExpenseId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(paid);
  const [amountPaid, setAmountPaid] = useState(amount);
  const [showEditPaymentStatus, setShowEditPaymentStatus] = useState(false);
  const [showModalAddExpense, setShowModalAddExpense] = useState(false);
  const [showExpenseEditModal, setShowExpenseEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalEditMonthClass, setModalEditMonthClass] = useState(styles.slideInLeft);
  const [modalAddExpenseClass, setModalAddExpenseClass] = useState(styles.slideInLeft);
  const [expenseEditModalClass, setExpenseEditModalClass] = useState(styles.slideInLeft);
  const [confirmModalClass, setConfirmModalClass] = useState("");

  const [expenseData, setExpenseData] = useState({
    id: "",
    amount: 0,
    reason: "",
  });

  const handleToggle = (status) => {
    setPaymentStatus(status);
  };

  const handleAmountPaid = (amount) => {
    setAmountPaid(amount);
  };

  const handleEditPaymentStatus = () => {
    setShowEditPaymentStatus(!showEditPaymentStatus);
    setPaymentStatus(paid);
  };

  const handleShowModalAddExpense = () => {
    setModalEditMonthClass(styles.slideOutLeft);

    setShowModalAddExpense(true);

    setModalAddExpenseClass(styles.slideInRight);
  };

  const editMonthData = async () => {
    if (!paymentStatus !== paid && amountPaid === amount) {
      toast.error("Você não editou nenhum campo!");
      return;
    }

    await axiosRepositoryInstance.updateRentMonth({
      rentId: rentId,
      rentMonthId: rentMonthId,
      paid: paymentStatus,
      amountPaid: amountPaid,
    });

    await fetchRentData(rentId);
    closeModal();
  };

  let expenses = rentData.months.find((month) => month.id === rentMonthId).expenses;

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
                <div onClick={handleEditPaymentStatus} className={styles.action}>
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
              Cancelar
            </button>
            <button onClick={editMonthData} className={`${styles.btn} ${styles.btnEdit}`}>
              Editar
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
    </>
  );
}
