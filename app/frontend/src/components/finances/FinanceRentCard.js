import styles from "./FinanceRentCard.module.css"

import rentIcon from "../../assets/rent-icon.svg"

export function FinanceRentCard({title, description, onButtonClick}) {
	return (
		<article className={styles.card}>
			<header className={styles.header}>
				<img src={rentIcon} alt="Icone do aluguel" />
				<h3> {title} </h3>
			</header>

			<section className={styles.cardContent}> 
				<p> {description} </p>
			</section>

			<footer className={styles.footer}>
				<button onClick={onButtonClick} className={styles.btn}> Ver detalhes </button>
			</footer>

		</article>
	)
}