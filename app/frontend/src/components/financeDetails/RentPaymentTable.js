import styles from "./RentPaymentTable.module.css";

import GoToPageicon from "../../assets/go-to-page.svg";
import SortIcon from "../../assets/sort-icon.svg";

import { getMonthName } from "../../utils/formatDate";
import { getYear } from "../../utils/formatDate";

import React, { useState, useMemo } from "react";

import { useFinance } from "../../hooks/useFinance";
import priceBRL from "../../utils/formatPrice";

export function RentPaymentTable({
  rentId = "",
  onEditMonth
}) {
  const { rentData } = useFinance();

  const availableYears = useMemo(() => {
    if (!rentData.months) return [];
    const years = new Set(rentData.months.map((m) => getYear(m.dateMonth)));
    return Array.from(years).sort((a, b) => b - a);
  }, [rentData.months]);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  
  const [selectedYear, setSelectedYear] = useState(
    availableYears.length > 0 ? availableYears[0] : "All"
  );

  const onSort = (columnKey) => {
    let direction = "ascending";

    if (sortConfig.key === columnKey && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key: columnKey, direction });
  };

  const filteredData = useMemo(() => {
    if (!rentData.months) return [];
    if (selectedYear === "All") return rentData.months;
    return rentData.months.filter((m) => getYear(m.dateMonth) === Number(selectedYear));
  }, [rentData.months, selectedYear]);

  const sortedData = useMemo(() => {
    if (sortConfig.key !== null) {
      const sorted = [...filteredData].sort((a, b) => {
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

    return filteredData;
  }, [filteredData, sortConfig]);

  return (
    <>
      <div className={styles.filterSection}>
        <h4 className={styles.tableTitle}>Histórico de pagamentos</h4>
        <div className={styles.filterControl}>
          <label htmlFor="yearFilter">Filtrar por ano:</label>
          <select 
            id="yearFilter"
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            className={styles.yearSelect}
          >
            <option value="All">Todos</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
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
              <th>Valor Esperado</th>
              <th>Valor Pago</th>
              <th>Diferença</th>
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
              const rentValue = parseFloat(rentData.value) || 0;
              const amountPaid = row.amountPaid || 0;
              const difference = row.difference !== undefined ? row.difference : rentValue - amountPaid;

              return (
                <tr key={index}>
                  <td>{getMonthName(row.dateMonth)}</td>
                  <td>{getYear(row.dateMonth)}</td>
                  <td className={styles.expectedValue}>{priceBRL(rentValue)}</td>
                  <td className={styles.paidValue}>{priceBRL(amountPaid)}</td>
                  <td className={difference > 0 ? styles.debtValue : styles.paidValue}>
                    {priceBRL(difference)}
                  </td>
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
                      onEditMonth({
                        nameMonth: getMonthName(row.dateMonth),
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
      </div>
    </>
  );
}
