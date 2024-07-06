import styles from "./Dashboard.module.css";

import { AssetCard } from "../components/dashboard/components/AssetCard";
import { FunctionalityCard } from "../components/dashboard/components/FunctionalityCard";

import expenseIcon from "../assets/expense.svg";
import categoryIcon from "../assets/category.svg";

import { useState } from "react";
import { Section } from "../components/dashboard/components/Section";

export function Dashboard() {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Meu patrimônio",
      money: "10.000",
    },
    {
      id: 2,
      name: "Investimentos",
      money: "10.000",
    },
    {
      id: 3,
      name: "Despesas",
      money: "10.000",
    },
    {
      id: 4,
      name: "Aluguel",
      money: "10.000",
    },
  ]);

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
        children={categories.map((asset) => (
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
