import styles from "./FinanceRentDetail.module.css";

import { RentPaymentTable } from "../components/financeDetails/RentPaymentTable";

import rentIcon from "../assets/rent-icon.svg";

import { useParams } from "react-router-dom";
import { RentData } from "../components/financeDetails/RentData";

import { useFinance } from "../hooks/useFinance";

import { useEffect } from "react";

export function FinanceRentDetail() {
  const { 
    financeData, 
    rentData, 
    fetchRentData, 
    fetchFinanceData 
  } = useFinance()

  const {financeId, rentId} = useParams();

	useEffect(() => {
		fetchFinanceData(financeId);
    // eslint-disable-next-line
	}, [])

  useEffect(() => {
    fetchRentData(rentId);
    // eslint-disable-next-line
  }, []);

  return (
    <main className={styles.finance}>
      <section className={styles.financeType}>
        <img src={rentIcon} alt="Rent" />
        <h3> {financeData.name} </h3>
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

      <RentPaymentTable
        rentId={rentData.id}
        months={rentData.months}
        rentalExpenses={rentData.expenses}
      />
    </main>
  );
}
