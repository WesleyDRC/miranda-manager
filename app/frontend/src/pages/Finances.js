import styles from "./Finances.module.css";

import { FinanceRentCard } from "../components/finances/FinanceRentCard";
import { Section } from "../components/dashboard/components/Section";

import { useFinance } from "../hooks/useFinance";

import { useEffect } from "react";
import { Link } from "react-router-dom";

export function Finances() {
  const { finances, fetchFinances } = useFinance();

  useEffect(() => {
    fetchFinances();
    // eslint-disable-next-line
  }, []);

  return (
    <main className={styles.finances}>
      <Section
        title="Finanças"
        children={
          finances.length === 0 ? (
            <span>Você ainda não possui nenhuma finança.
              <Link to="/finance/create" className={styles.btn}>
                Clique aqui para cadastrar!
              </Link>
            </span>
          ) : (
            finances.map((finance) => {
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
            })
          )
        }
      />
    </main>
  );
}
