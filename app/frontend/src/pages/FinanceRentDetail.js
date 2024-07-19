import styles from "./FinanceRentDetail.module.css";

import { RentPaymentTable } from "../components/financeDetails/RentPaymentTable";

import rentIcon from "../assets/rent-icon.svg";

import axiosRepositoryInstance from "../repository/AxiosRepository";

import { useParams } from "react-router-dom";
import { RentData } from "../components/financeDetails/RentData";
import { useEffect, useState, useCallback } from "react";

export function FinanceRentDetail() {
  const {financeId, rentId} = useParams();
  const [rentData, setRentData] = useState([]);
  const [financeData, setFinanceData] = useState([]);


	const fetchFinanceData = useCallback(() => {
    axiosRepositoryInstance.getFinanceById({ id: financeId }).then((resp) => {
			setFinanceData(resp.data.finance);
      }).catch((error) => {
      });
  }, [financeId]);

  const fetchRentData = useCallback(() => {
    axiosRepositoryInstance.getRentById({ id:rentId }).then((resp) => {
				setRentData(resp.data.rent);
      }).catch((error) => {
      });
  }, [rentId]);

  useEffect(() => {
    fetchRentData();
  }, [fetchRentData]);

	useEffect(() => {
		fetchFinanceData();
	}, [fetchFinanceData])

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
        onRefresh={fetchRentData}
        amount={rentData.value}
      />
    </main>
  );
}
