import styles from "./CreateFinance.module.css";

import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";

import { Select } from "../components/createFinance/Select";
import { ButtonNextStep } from "../components/createFinance/ButtonNextStep";
import { Section } from "../components/dashboard/components/Section";
import { Subtitle } from "../components/createFinance/Subtitle";

import { RentalFinanceForm } from "../components/createFinance/RentalFinanceForm";

import { useState } from "react";

export function CreateFinance() {
  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep(step + 1);
  };

  const previousStep = () => {
    setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Section title="Criar finança">
            <div>
              <Subtitle step={step} text="Selecione o tipo da finança" />
              <Select />
              <ButtonNextStep text={"Próxima etapa"} onClick={nextStep} />
            </div>
          </Section>
        );
      case 2:
        return (
          <Section title="Criar finança">
            <div>
              <Subtitle
                step={step}
                text="Preencha os campos para a finança aluguel "
              />
              <RentalFinanceForm />
            </div>
          </Section>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.content}>
      <Sidebar />

      <div className={styles.coreContent}>
        <Header />
        <main className={styles.main}>{renderStep()}</main>
      </div>
    </div>
  );
}
