import styles from "./RentPaymentTable.module.css";

import GoToPageicon from "../../assets/go-to-page.svg";
import SortIcon from "../../assets/sort-icon.svg";

import React, { useState } from "react";

export function RentPaymentTable() {
  const [data, setData] = useState([
    { monthNumber: 1, month: "Janeiro", year: 2024, status: "PENDENTE" },
    { monthNumber: 2, month: "Fevereiro", year: 2024, status: "PAGO" },
    { monthNumber: 3, month: "Março", year: 2024, status: "PAGO" },
    { monthNumber: 4, month: "Abril", year: 2024, status: "PAGO" },
    { monthNumber: 5, month: "Maio", year: 2024, status: "PAGO" },
    { monthNumber: 6, month: "Junho", year: 2024, status: "PAGO" },
  ]);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const onSort = (columnKey) => {
    let direction = "ascending";

    if (sortConfig.key === columnKey && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key: columnKey, direction });
  };

  const sortedData = React.useMemo(() => {
    if (sortConfig.key !== null) {
      const sorted = [...data].sort((a, b) => {
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

    return data;
  }, [data, sortConfig]);

  return (
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
        {sortedData.map((row, index) => (
          <tr key={index}>
            <td>{row.month}</td>
            <td>{row.year}</td>
            <td
              className={
                row.status === "PENDENTE"
                  ? styles.pendingStatus
                  : styles.paidStatus
              }
            >
              {row.status}
            </td>
            <td className={styles.editarLink}>
              <img src={GoToPageicon} alt="Go to Page icon" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
