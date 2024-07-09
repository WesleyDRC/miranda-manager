import styles from "./CreateFinance.module.css";

import { Select } from "../components/createFinance/Select";
import { ButtonNextStep } from "../components/createFinance/ButtonNextStep";
import { Step } from "../components/createFinance/Step";
import { RentalFinanceForm } from "../components/createFinance/RentalFinanceForm";

import AxiosRepository from "../repository/AxiosRepository";

import { useState, useEffect } from "react";

export function CreateFinance() {
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    AxiosRepository.getCategories()
      .then((response) => {
        setCategories(response.data.categories);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
              <Select options={categories} onSelect={onSelect} />
              <ButtonNextStep text={"Próxima etapa"} onClick={nextStep} />
            </div>
          </Step>
        );
      case 2:
          const categoryRent = categories.find(category => category.name === "Aluguel")

          if (categoryRent) {
              return (
                <Step
                  title="Criar finança"
                  step={step}
                  text={"Preencha os campos para a finança aluguel"}
                  previousStep={previousStep}
                >
                  <div>
                    <RentalFinanceForm selectedOption={selectedOption} />
                  </div>
                </Step>
              );
          }

      /* falls through */
      default:
        return null;
    }
  };

  return <main className={styles.main}>{renderStep()}</main>;
}
