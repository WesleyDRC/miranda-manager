import styles from "./FinanceDetail.module.css"

import { AssetCard } from "../components/dashboard/components/AssetCard"

import rentIcon from "../assets/rent-icon.svg"

import { useParams } from "react-router-dom"

export function FinanceDetail() {

	const { id } = useParams()

	console.log(`ID: ${id}`)

	return (
		<main className={styles.finance}>	
			<section className={styles.financeType}>
				<img src={rentIcon} alt="Rent" />
				<h3> Aluguel do Antonio </h3>
			</section>

			<section className={styles.financeData}>
				<h4> Dados do aluguel </h4>
				<div className={styles.tenantData}>
					<dl className={styles.descriptonList}>
						<dt>Inquilino</dt>
						<dd>Antonio Luis</dd>

						<dt>Valor</dt>
						<dd>R$ 500,00</dd>

						<dt>Rua</dt>
						<dd>Avenida Brasil</dd>

						<dt>Nº</dt>
						<dd>199</dd>

						<dt>Início do Aluguel</dt>
						<dd>20/07/2024</dd>
					</dl>

					<div className={styles.cards}>
						<AssetCard name="Ganhos brutos" money={"10.000"}/>
						<AssetCard name="Ganho líquido" money={"5.000"} />
					</div>
				</div>
			</section>
		</main>
	)
}