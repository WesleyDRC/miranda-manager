import styles from "./FinanceRentDetail.module.css";

import { RentPaymentTable } from "../components/financeDetails/RentPaymentTable";
import { NotFound } from "./NotFound";
import ModalEditMonthRent from "../components/financeDetails/ModalEditMonthRent";

import rentIcon from "../assets/rent-icon.svg";

import { TenantDebtSummary } from "../components/financeDetails/TenantDebtSummary";
import { ModalAllPendingMonths } from "../components/financeDetails/ModalAllPendingMonths";
import { isEmpty } from "../utils/isEmpty";

import { useParams } from "react-router-dom";
import { useFinance } from "../hooks/useFinance";
import { useEffect, useState } from "react";

export function FinanceRentDetail() {
  const {
    financeData,
    rentData,
    fetchRentData,
    fetchFinanceData,
    loadingRentData
  } = useFinance()

  const {financeId, rentId} = useParams();

  const [isModalEditMonthOpen, setIsModalEditMonthOpen] = useState(false);
  const [isModalAllPendingOpen, setIsModalAllPendingOpen] = useState(false);
  
  const [currentMonth, setCurrentMonth] = useState("");
  const [currentMonthID, setCurrentMonthID] = useState("");
  const [amountPaid, setAmountPaid] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState(false);

  const handleEditMonth = ({ nameMonth, paid, rentMonthId, amountPaid }) => {
    setCurrentMonth(nameMonth);
    setPaymentStatus(paid);
    setCurrentMonthID(rentMonthId);
    setAmountPaid(amountPaid);
    setIsModalEditMonthOpen(true);
  };

  const closeModalEditMonth = () => {
    setIsModalEditMonthOpen(false);
  };

  const openAllPendingModal = () => {
    setIsModalAllPendingOpen(true);
  };

  const closeAllPendingModal = () => {
    setIsModalAllPendingOpen(false);
  };

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
    <>
      <main className={styles.finance}>
        <section className={styles.financeType}>
          <img src={rentIcon} alt="Rent" />
          <h3> {financeData.name} </h3>
        </section>

        <TenantDebtSummary 
          rentData={rentData} 
          onEditMonth={handleEditMonth}
          onViewAll={openAllPendingModal}
        />

        <RentPaymentTable
          rentId={rentData.id}
          rentValue={rentData.value}
          months={rentData.months}
          rentalExpenses={rentData.expenses}
          onEditMonth={handleEditMonth}
        />
      </main>

      {isModalEditMonthOpen && (
        <ModalEditMonthRent
          rentId={rentData.id}
          rentMonthId={currentMonthID}
          month={currentMonth}
          paid={paymentStatus}
          closeModal={closeModalEditMonth}
          amount={amountPaid}
        />
      )}

      {isModalAllPendingOpen && (
        <ModalAllPendingMonths
          pendingMonths={rentData.months.filter((m) => !m.paid)}
          rentValue={parseFloat(rentData.value) || 0}
          onEditMonth={handleEditMonth}
          closeModal={closeAllPendingModal}
        />
      )}
    </>
  );
}
