import styles from "./CreateFinance.module.css";

import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";

import { Select } from "../components/createFinance/Select";
import { ButtonNextStep } from "../components/createFinance/ButtonNextStep";
import { Step } from "../components/createFinance/Step";

import { RentalFinanceForm } from "../components/createFinance/RentalFinanceForm";

import { useState } from "react";

export function CreateFinance() {
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState("");

  const options = [
    {
      id: 1,
      type: "Aluguel",
    },
    {
      id: 2,
      type: "CDB",
    },
    {
      id: 3,
      type: "Tesouro Direto"
    }
  ]

  const onSelect = (value) => {
    setSelectedOption(value);
  };

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
          <Step
            title="Criar finança"
            step={step}
            text={"Selecione o tipo da finança"}
          >
            <div>
              <Select options={options} onSelect={onSelect} />
              <ButtonNextStep text={"Próxima etapa"} onClick={nextStep} />
            </div>
          </Step>
        );
      case 2:
        if (selectedOption === "Aluguel") {
          return (
            <Step
              title="Criar finança"
              step={step}
              text={"Preencha os campos para a finança aluguel"}
              previousStep={previousStep}
            >
              <div>
                <RentalFinanceForm />
              </div>
            </Step>
          );
        }
       /* falls through */
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
