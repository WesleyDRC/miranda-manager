import styles from "./EditPaymentStatus.module.css"

import { useState, useEffect} from "react"

export function EditPaymentStatus({paid, onToggle}) {

	const [isToggle, setIsToggle] = useState(false)

	const handleToggleButton = () => {
		setIsToggle(!isToggle)
	}

	useEffect(() => {
    if (onToggle) {
      onToggle(isToggle);
    }
  }, [isToggle, onToggle]);

	return (
		<div className={styles.editPaymentStatus}>
			<div onClick={handleToggleButton} className={`${styles.toggleButton} ${!isToggle ? styles.unPaid : styles.paid}`}>
				<div className={styles.toggleCircle}></div>
			</div>
			<span className={paid ? styles.paidTxt : styles.unPaidTxt}> {paid ? "PAGO" : "PENDENTE"} </span>
		</div>
	)
}