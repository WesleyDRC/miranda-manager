import styles from "./Dashboard.module.css";

import { AssetCard } from "../components/dashboard/components/AssetCard";
import { FunctionalityCard } from "../components/dashboard/components/FunctionalityCard";

import expenseIcon from "../assets/expense.svg";
import categoryIcon from "../assets/category.svg";

import { Section } from "../components/dashboard/components/Section";

import { useFinance } from "../hooks/useFinance";

import { useEffect } from "react";

export function Dashboard() {

  const { 
    totalRentalEarnings, 
    totalAssets, 
    fetchFinances 
  } = useFinance();

  useEffect(() => {
    fetchFinances()
    // eslint-disable-next-line
  }, [])

  console.log(totalRentalEarnings)

  const assets = [
    {
      id: 1,
      name: "Meu patrimônio",
      money: totalAssets,
    },
    {
      id: 2,
      name: "Investimentos",
      money: "0",
    },
    {
      id: 3,
      name: "Despesas",
      money: "0",
    },
    {
      id: 4,
      name: "Aluguel",
      money: totalRentalEarnings
    },
  ];

  const functionalities = [
    {
      id: 1,
      icon: expenseIcon,
      name: "Criar finança",
      path: "/finance/create",
    },
    {
      id: 2,
      icon: categoryIcon,
      name: "Criar categoria",
      path: "/category/create",
    },
  ];

  return (
    <main className={styles.main}>
      <Section
        title="Dashboard"
        children={assets.map((asset) => (
          <AssetCard key={asset.id} name={asset.name} money={asset.money} />
        ))}
      />

      <Section
        title="Funcionalidades"
        children={functionalities.map((functionality) => (
          <FunctionalityCard
            path={functionality.path}
            key={functionality.id}
            icon={functionality.icon}
            alt={functionality.name}
            name={functionality.name}
          />
        ))}
      />
    </main>
  );
}
