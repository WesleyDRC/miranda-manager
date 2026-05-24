import styles from "./ModalAddPayment.module.css";
import CloseIcon from "../../assets/close-icon.svg";
import { useState } from "react";
import axiosRepositoryInstance from "../../repository/AxiosRepository";
import { toast } from "react-toastify";
import { useFinance } from "../../hooks/useFinance";

export function ModalAddPayment({
  rentId,
  rentMonthId,
  closeModal,
  modalAddPaymentClass,
}) {
  const { fetchRentData, fetchFinanceData } = useFinance();
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAmountInput = (event) => {
    const { value } = event.target;
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(value)) {
      setAmount(value);
    }
  };

  const handleDateInput = (event) => {
    setPaymentDate(event.target.value);
  };

  const savePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Insira um valor válido.");
      return;
    }
    if (!paymentDate) {
      toast.error("Insira uma data válida.");
      return;
    }

    setLoading(true);
    const response = await axiosRepositoryInstance.createRentPayment({
      amount: parseFloat(amount),
      paymentDate: new Date(paymentDate).toISOString(),
      rentMonthId,
    });

    if (response.status !== 200) {
      toast.error(response.data.message || "Erro ao adicionar pagamento");
      setLoading(false);
      return;
    }

    toast.success("Pagamento adicionado com sucesso!");
    await fetchRentData(rentId);
    
    // Also fetch finance data to update global gross income in the background
    const financeId = window.location.pathname.split("/")[2]; // Assuming /finance/:financeId/...
    if(financeId) {
      fetchFinanceData(financeId);
    }

    setLoading(false);
    closeModal();
  };

  return (
    <div className={styles.modal} aria-labelledby="modalTitle">
      <div className={`${styles.modalContent} ${modalAddPaymentClass}`}>
        <header className={styles.modalHeader}>
          <h2 className={styles.title} id="modalTitle">
            Adicionar Pagamento
          </h2>
          <button onClick={closeModal} disabled={loading}>
            <img className={styles.icon} src={CloseIcon} alt="Close Modal Icon" />
          </button>
        </header>

        <main className={styles.modalBody}>
          <div className={styles.inputGroup}>
            <label htmlFor="paymentDate">Data do Pagamento</label>
            <input
              type="date"
              id="paymentDate"
              value={paymentDate}
              onChange={handleDateInput}
              className={styles.input}
              disabled={loading}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="amount">Valor Pago</label>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={handleAmountInput}
              placeholder="Ex: 150.50"
              className={styles.input}
              disabled={loading}
            />
          </div>
        </main>

        <footer className={styles.modalFooter}>
          <button
            onClick={closeModal}
            className={`${styles.btn} ${styles.btnCancel}`}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={savePayment}
            className={`${styles.btn} ${styles.btnSave}`}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </footer>
      </div>
    </div>
  );
}
