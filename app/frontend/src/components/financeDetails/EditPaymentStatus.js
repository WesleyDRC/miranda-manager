import styles from "./EditPaymentStatus.module.css"

import { useState, useEffect} from "react"

export function EditPaymentStatus({paid, onToggle, onAmountPaid, amount}) {
	const [isToggle, setIsToggle] = useState(paid)
  const [amountPaid, setAmountPaid] = useState(amount);

	useEffect(() => {
    if (onToggle) {
      onToggle(isToggle);
    }
  }, [isToggle, onToggle]);

	useEffect(() => {
    if (onAmountPaid) {
      onAmountPaid(amountPaid);
    }
  }, [amountPaid, onAmountPaid]);

	const handleToggleButton = () => {
		setIsToggle(!isToggle)
	}

	const handleAmountPaidInput = (event) => {
    const { value } = event.target;

    const regex = /^\d*$/; 

    if (regex.test(value)) {
      setAmountPaid(value);
    }
  };

	return (
		<>
			<div className={styles.editPaymentStatus}>
				<div onClick={handleToggleButton} className={`${styles.toggleButton} ${!isToggle ? styles.unPaid : styles.paid}`}>
					<div className={styles.toggleCircle}></div>
				</div>
				<span className={paid ? styles.paidTxt : styles.unPaidTxt}> {paid ? "PAGO" : "PENDENTE"} </span>
			</div>

			<div className={styles.amountPaid}>
				<div className={styles.amountPaidInput}>
					<input 
						value={amountPaid}
						onChange={handleAmountPaidInput}
						className={styles.formControl} placeholder=" "
					/>
					
					<label className={styles.formLabel}>
						Valor pago
					</label>
				</div>
			</div>

		</>

	)
}