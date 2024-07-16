import styles from "./FinanceRentDetail.module.css"

import { RentPaymentTable } from "../components/financeDetails/RentPaymentTable"

import rentIcon from "../assets/rent-icon.svg"

import axiosRepositoryInstance from "../repository/AxiosRepository" 

import { useParams } from "react-router-dom"
import { RentData } from "../components/financeDetails/RentData"
import { useEffect, useState } from "react"

export function FinanceRentDetail() {

	const { id } = useParams()

	const [rentData, setRentData] = useState([])

	useEffect(() => {
		axiosRepositoryInstance.getRentById({id}).then((resp) => {
			setRentData(resp.data.rent)
		}).catch((error) => {
		})
	}, [id])

	console.log(rentData)

	return (
		<main className={styles.finance}>	
			<section className={styles.financeType}>
				<img src={rentIcon} alt="Rent" />
				<h3> Aluguel do Antonio </h3>
			</section>

			<section className={styles.financeData}>
				<h4> Dados do aluguel </h4>
				<RentData   
					tenant={rentData.name}
  				rentValue={rentData.value}
  				street={rentData.street}
 					streetNumber={rentData.streetNumber}
  				startRent={rentData.startRental}
  				grossIncome={rentData.grossIncome}
  				netIncome={rentData.netIncome}
				/>
			</section>

			<RentPaymentTable months={rentData.months} rentalExpeneses={rentData.expenses} />

		</main>
	)
}