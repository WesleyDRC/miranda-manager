import styles from "./RentPaymentTable.module.css";

import ModalEditMonthRent from "./ModalEditMonthRent";

import GoToPageicon from "../../assets/go-to-page.svg";
import SortIcon from "../../assets/sort-icon.svg";

import { getMonthName } from "../../utils/formatDate"
import { getYear } from "../../utils/formatDate"

import React, { useState } from "react";

export function RentPaymentTable({ months = [], rentalExpeneses=[] }) {

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState('');

  const onSort = (columnKey) => {
    let direction = "ascending";

    if (sortConfig.key === columnKey && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key: columnKey, direction });
  };

  const sortedData = React.useMemo(() => {
    if (sortConfig.key !== null) {
      const sorted = [...months].sort((a, b) => {
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

    return months;
  }, [months, sortConfig]);

  const handleEditMonth = ({ month }) => {
    setCurrentMonth(month);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
        {sortedData.map((row, index) => {
          return (
            <tr key={index}>
              <td>{getMonthName(row.dateMonth)}</td>
              <td>{getYear(row.dateMonth)}</td>
              <td
                className={
                  !row.paid
                    ? styles.pendingStatus
                    : styles.paidStatus
                }
              >
                {!row.paid ? "PENDENTE" : "PAGO"}
              </td>
              <td className={styles.editLink} onClick={() => handleEditMonth({ month: getMonthName(row.dateMonth)})}>
                <span>
                  <img src={GoToPageicon} alt="Go to Page icon" />
                </span>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>

    {isModalOpen && <ModalEditMonthRent month={currentMonth} closeModal={closeModal} rentalExpeneses={rentalExpeneses}/>}
    </>
  );
}
