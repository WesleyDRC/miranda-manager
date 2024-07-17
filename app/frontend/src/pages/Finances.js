import styles from "./Finances.module.css";

import { FinanceRentCard } from "../components/finances/FinanceRentCard";

import AxiosRepository from "../repository/AxiosRepository";

import { useEffect, useState } from "react";

export function Finances() {
  const [finances, setFinances] = useState([]);

  useEffect(() => {
    AxiosRepository.getFinances().then((resp) => {
      setFinances(resp.data.finances);
    });
  }, []);

  return (
    <main className={styles.finances}>
      {finances.map((finance) => {
        if (finance.category.name === "Aluguel")
          return (
            <FinanceRentCard
              key={finance.id}
              financeId={finance.id}
              rentId={finance.rent._id}
              title={finance.category.name}
              description={finance.name}
            />
          );

        return (
          <span>
            Você ainda não possui nenhuma finança. Clique aqui para cadastrar!
          </span>
        )
      })}
    </main>
  );
}
