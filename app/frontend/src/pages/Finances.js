import styles from "./Finances.module.css";

import { FinanceRentCard } from "../components/finances/FinanceRentCard";

import { useFinance } from "../hooks/useFinance";

import { useEffect } from "react";

export function Finances() {
  const { finances, fetchFinances } = useFinance();

  useEffect(() => {
    fetchFinances()
    // eslint-disable-next-line
  }, [])

  return (
    <main className={styles.finances}>
      {finances.map((finance) => {
        if (finance.category.name === "Aluguel")
          return (
            <FinanceRentCard
              key={finance.id}
              financeId={finance.id}
              rentId={finance.rent.id}
              title={finance.category.name}
              description={finance.name}
            />
          );

        return (
          <span>
            Você ainda não possui nenhuma finança. Clique aqui para cadastrar!
          </span>
        );
      })}
    </main>
  );
}
