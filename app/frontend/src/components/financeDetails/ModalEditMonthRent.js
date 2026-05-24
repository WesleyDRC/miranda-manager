import styles from "./ModalEditMonthRent.module.css";

import ModalAddExpense from "./ModalAddExpense";
import { ExpenseEditModal } from "./ExpenseEditModal";
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

import { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaCloudUploadAlt,
  FaSearchPlus,
  FaRegFileImage,
  FaTrashAlt,
} from "react-icons/fa";

import { toast } from "react-toastify";

export default function ModalEditMonthRent({
  rentId = "",
  rentMonthId = "",
  month = "Janeiro",
  paid = false,
  closeModal,
  amount = 0,
}) {
  const { rentData, fetchRentData, receipts, fetchFinanceData, fetchRentReceipts } = useFinance();

  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [newReceipt, setNewReceipt] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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

      // Update parent data
      const financeId = window.location.pathname.split("/")[2];
      if (financeId) {
        fetchFinanceData(financeId);
      }
      await fetchRentData(rentId);
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

        // Update parent data
        const financeId = window.location.pathname.split("/")[2];
        if (financeId) {
          fetchFinanceData(financeId);
        }
        await fetchRentData(rentId);
      } else {
        toast.error("Erro ao excluir o comprovante.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir comprovante.");
    }
  };

  const [expenseId, setExpenseId] = useState("");
  const [showModalAddExpense, setShowModalAddExpense] = useState(false);
  const [showExpenseEditModal, setShowExpenseEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showModalAddPayment, setShowModalAddPayment] = useState(false);
  const [showConfirmPaymentModal, setShowConfirmPaymentModal] = useState(false);
  const [paymentIdToDelete, setPaymentIdToDelete] = useState("");
  const [modalEditMonthClass, setModalEditMonthClass] = useState(styles.slideInLeft);
  const [modalAddExpenseClass, setModalAddExpenseClass] = useState(styles.slideInLeft);
  const [expenseEditModalClass, setExpenseEditModalClass] = useState(styles.slideInLeft);
  const [modalAddPaymentClass, setModalAddPaymentClass] = useState(styles.slideInLeft);
  const [confirmModalClass, setConfirmModalClass] = useState("");

  const [expenseData, setExpenseData] = useState({
    id: "",
    amount: 0,
    reason: "",
  });

  useEffect(() => {
    if (rentMonthId) {
      fetchRentReceipts(rentMonthId);
    }
    // eslint-disable-next-line
  }, [rentMonthId]);

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
              <div className={styles.sectionTitle} style={{ marginBottom: "16px" }}>
                <h3 id="receiptsTitle"> Comprovantes </h3>
              </div>

              {/* Direct File Selector Dropzone */}
              <div className={styles.uploadSection}>
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
                      <strong>Clique ou arraste</strong> o comprovante aqui
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
              </div>

              {/* Receipts Grid */}
              {receipts && receipts.length > 0 ? (
                <div className={styles.boxReceipts}>
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
                  <p>Nenhum comprovante enviado para este mês.</p>
                </div>
              )}
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
