import styles from "./RentData.module.css"

import { AssetCard } from "../dashboard/components/AssetCard"

import priceBRL from "../../utils/formatPrice"

import {formatDate } from "../../utils/formatDate"

export function RentData({
	tenant,
  rentValue,
  street,
  streetNumber,
  startRent,
  grossIncome,
  netIncome
}) {

	return (
		<div className={styles.tenantData}>
			<dl className={styles.descriptonList}>
				<dt>Inquilino</dt>
				<dd>{tenant}</dd>

				<dt>Valor</dt>
				<dd>{priceBRL(parseFloat(rentValue))}</dd>

				<dt>Rua</dt>
				<dd>{street}</dd>

				<dt>Nº</dt>
				<dd>{streetNumber}</dd>

				<dt>Início do Aluguel</dt>
				<dd>{formatDate(startRent)}</dd>
			</dl>

			<div className={styles.cards}>
				<AssetCard name="Ganhos brutos" money={priceBRL(parseFloat(grossIncome))}/>
				<AssetCard name="Ganho líquido" money={priceBRL(parseFloat(netIncome))} />
			</div>
		</div>
	)
}