import styles from "./ModalAddExpense.module.css";

import CloseIcon from "../../assets/close-icon.svg";

import priceBRL from "../../utils/formatPrice";

import axiosRepositoryInstance  from "../../repository/AxiosRepository";

import { useFinance } from "../../hooks/useFinance";

import { useState } from "react";

export default function ModalAddExpense({
  rentId = "",
  rentMonthId = "",
  month = "...",
  expenses = [],
  closeModal,
  modalAddExpenseClass
}) {

  const {
    fetchRentData
  } = useFinance()

	const [amount, setAmount] = useState('');
	const [reason, setReason] = useState('');

	const handleInput = (event) => {
    const { value } = event.target;

    const regex = /^\d*$/; 

    if (regex.test(value)) {
      setAmount(value);
    }
  };

  const addExpense = async () => {

    await axiosRepositoryInstance.createExpense({
      amount,
      reason,
      rentMonthId
    })

    await fetchRentData(rentId)
    clearFields()
  }

  const clearFields = () => {
    setAmount("")
    setReason("")
  }
  

  return (
    <div         
      className={styles.modal}
      aria-labelledby="modalTitle"
    >
      <div className={`${styles.modalContent} ${modalAddExpenseClass}`}>
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
          <section aria-labelledby="spendingTitle">
            <div className={styles.title}>
              <h3 id="spendingTitle"> Gastos do mês </h3>
            </div>
					</section>

					<section aria-labelledby="addExpense">
						<div className={styles.sectionSubTitle}>
              <h3 id="addExpense"> Adicionar  gasto </h3>
            </div>

						<div className={styles.addExpense}>
							<input 
								value={amount} 
								onChange={handleInput} 
								placeholder="Valor" 
								className={styles.inputAmount} 
							/>

							<textarea 
                value={reason} 
                onChange={(e) => setReason(e.target.value)} 
                placeholder="Motivo" 
                className={styles.reason}
              ></textarea>

							<div className={styles.addExpenseButton}>
								<button
										onClick={addExpense}
										className={styles.btn}
									>
									Adicionar
								</button>
							</div>

						</div>
					</section>

					<section aria-labelledby="expenseList">
						<div className={styles.sectionSubTitle}>
              <h3 id="expenseList"> Lista de gastos </h3>
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
                  {expenses && expenses.map((expense, index) => (
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

      </div>
    </div>
  );
}
