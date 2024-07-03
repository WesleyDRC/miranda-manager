import styles from "./CreateFinance.module.css";

import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";

import { Select } from "../components/createFinance/Select";
import { ButtonNextStep } from "../components/createFinance/ButtonNextStep";
import { Section } from "../components/dashboard/components/Section";
import { Subtitle } from "../components/createFinance/Subtitle";

export function CreateFinance() {
  return (
    <div className={styles.content}>
      <Sidebar />

      <div className={styles.coreContent}>
        <Header />
        <main className={styles.main}>
          <Section
            title="Criar finança"
            children={
              <div>
								<Subtitle />
								<Select />
								<ButtonNextStep />
              </div>
            }
          />
        </main>
      </div>
    </div>
  );
}
