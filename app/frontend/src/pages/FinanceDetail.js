import styles from "./FinanceDetail.module.css"

import { useParams } from "react-router-dom"

export function FinanceDetail() {

	const { id } = useParams()

	console.log(`ID: ${id}`)

	return (
		<main className={styles.finances}>	
			<h1> Finance </h1>
		</main>
	)
}