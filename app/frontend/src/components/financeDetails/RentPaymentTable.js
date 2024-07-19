import styles from "./RentPaymentTable.module.css";

import ModalEditMonthRent from "./ModalEditMonthRent";

import GoToPageicon from "../../assets/go-to-page.svg";
import SortIcon from "../../assets/sort-icon.svg";

import { getMonthName } from "../../utils/formatDate";
import { getYear } from "../../utils/formatDate";

import React, { useState } from "react";

import { useFinance } from "../../hooks/useFinance";

export function RentPaymentTable({
  rentId = "",
}) {
  const { rentData } = useFinance();

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [isModalEditMonthOpen, setIsModalEditMonthOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState("");
  const [currentMonthID, setCurrentMonthID] = useState("");
  const [amountPaid, setAmountPaid] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState(false);

  const onSort = (columnKey) => {
    let direction = "ascending";

    if (sortConfig.key === columnKey && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key: columnKey, direction });
  };

  const sortedData = React.useMemo(() => {
    if (sortConfig.key !== null && rentData.months !== undefined) {
      const sorted = [...rentData.months].sort((a, b) => {
        if (sortConfig.key === "status") {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }

        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }

        return 0;
      });
      return sorted;
    }

    return rentData.months;
  }, [rentData, sortConfig]);

  const handleEditMonth = ({ month, paid, rentMonthId, amountPaid }) => {
    setCurrentMonth(month);
    setPaymentStatus(paid);
    setCurrentMonthID(rentMonthId);
    setAmountPaid(amountPaid)
    setIsModalEditMonthOpen(true);
  };

  const closeModalEditMonth = () => {
    setIsModalEditMonthOpen(false);
  };

  return (
    <>
      <table className={styles.paymentsTable}>
        <thead>
          <tr>
            <th onClick={() => onSort("monthNumber")}>
              <div className={styles.headerContent}>
                Mês <img src={SortIcon} alt="Sort icon" />
              </div>
            </th>
            <th onClick={() => onSort("year")}>
              <div className={styles.headerContent}>
                Ano <img src={SortIcon} alt="Sort icon" />
              </div>
            </th>
            <th onClick={() => onSort("status")}>
              <div className={styles.headerContent}>
                Status <img src={SortIcon} alt="Sort icon" />
              </div>
            </th>
            <th>Editar</th>
          </tr>
        </thead>

        <tbody>
          {sortedData && sortedData.map((row, index) => {
            return (
              <tr key={index}>
                <td>{getMonthName(row.dateMonth)}</td>
                <td>{getYear(row.dateMonth)}</td>
                <td
                  className={
                    !row.paid ? styles.pendingStatus : styles.paidStatus
                  }
                >
                  {!row.paid ? "PENDENTE" : "PAGO"}
                </td>
                <td
                  className={styles.editLink}
                  onClick={() =>
                    handleEditMonth({
                      month: getMonthName(row.dateMonth),
                      paid: row.paid,
                      rentMonthId: row.id,
                      amountPaid: row.amountPaid
                    })
                  }
                >
                  <span>
                    <img src={GoToPageicon} alt="Go to Page icon" />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {isModalEditMonthOpen && (
        <ModalEditMonthRent
          rentId={rentId}
          rentMonthId={currentMonthID}
          month={currentMonth}
          paid={paymentStatus}
          closeModal={closeModalEditMonth}
          amount={amountPaid}
        />
      )}
    </>
  );
}
