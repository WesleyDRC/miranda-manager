import styles from "./CreateFinance.module.css";

import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";

import { ButtonNextStep } from "../components/createFinance/ButtonNextStep";

import { useState } from "react";
import { Section } from "../components/dashboard/components/Section";

export function CreateFinance() {

	const [financeType, setFinanceType] = useState("")

	const handleSelect = (event) => {
    setFinanceType(event.target.value);
  };

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
                <div className={styles.subtitle}>
                  <div className={styles.circle}>
                    <span className={styles.stepNumber}>1</span>
                  </div>
                  <span className={styles.subtitleText}>
                    Selecione o tipo da finança
                  </span>
                </div>
								
								<div className={styles.customSelect}>
									<select
									value={financeType}
									className={styles.select}
									onChange={handleSelect}
									>
										<option value="" disabled> </option>
										<option value="Aluguel"> Aluguel</option>
										<option value="CDB"> CDB</option>
										<option value="Tesouro Direto"> Tesouro Direto </option>
									</select>
								</div>

								<ButtonNextStep />


              </div>
            }
          />
        </main>
      </div>
    </div>
  );
}
