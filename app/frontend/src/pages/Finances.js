import styles from "./Finances.module.css"

import { FinanceRentCard } from "../components/finances/FinanceRentCard"


export function Finances() {
	return (
		<main className={styles.finances}>
			<FinanceRentCard title={"Aluguel"} description={"Aluguel do Antonio"} />
			<FinanceRentCard title={"Aluguel"} description={"Aluguel do Antonio"} />
		</main>
	)
}