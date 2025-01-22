import styles from "./FinanceRentDetail.module.css";

import { RentPaymentTable } from "../components/financeDetails/RentPaymentTable";
import { NotFound } from "./NotFound";

import rentIcon from "../assets/rent-icon.svg";

import { RentData } from "../components/financeDetails/RentData";
import { isEmpty } from "../utils/isEmpty";

import { useParams } from "react-router-dom";
import { useFinance } from "../hooks/useFinance";
import { useEffect } from "react";

export function FinanceRentDetail() {
  const { 
    financeData, 
    rentData, 
    fetchRentData, 
    fetchFinanceData,
    loadingRentData
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

  if(loadingRentData) {
    return (
      <h1> Carregando</h1>
    )
  }

  if(!loadingRentData && isEmpty(rentData)) {
    return (
      <NotFound />
    )
  }

  return (
    <main className={styles.finance}>
      <section className={styles.financeType}>
        <img src={rentIcon} alt="Rent" />
        <h3> {financeData.name} </h3>
      </section>

      <section className={styles.financeData}>
        <h4> Dados do aluguel </h4>
        <RentData
          tenant={rentData.tenant}
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
