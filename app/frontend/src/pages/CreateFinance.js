import styles from "./CreateFinance.module.css";

import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";

import { Select } from "../components/createFinance/Select";
import { ButtonNextStep } from "../components/createFinance/ButtonNextStep";
import { Section } from "../components/dashboard/components/Section";
import { Subtitle } from "../components/createFinance/Subtitle";

import { Input } from "../components/createFinance/Input";

import { useState } from "react";

export function CreateFinance() {


  const [formData, setFormData] = useState({
    financeName: "",
    street: "",
    number: "",
    value: "",
    rentalDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
                <Subtitle step="1" text="Selecione o tipo da finança" />
                <Select />
                <ButtonNextStep text={"Próxima etapa"} />
              </div>
            }
          />
          <Section
            title="Criar finança"
            children={
              <div>
                <Subtitle
                  step="2"
                  text="Preencha os campos para a finança aluguel "
                />
                <div className={styles.fields}>
                  <Input
                    id="financeName"
                    name="financeName"
                    placeholder=" "
                    value={formData.financeName}
                    onChange={handleChange}
                    text="Nome da finança"
                  />
                  <div className={styles.streetAndNumber}>
                    <Input
                      id="rentalStreet"
                      name="rentalStreet"
                      placeholder=" "
                      value={formData.street}
                      onChange={handleChange}
                      text="Rua"
                    />
                    <Input
                      id="rentalNumber"
                      name="rentalNumber"
                      placeholder=" "
                      value={formData.number}
                      onChange={handleChange}
                      text="N°"
                      customClass={"streetNumber"}
                    />
                  </div>

                  <Input
                    id="rentalValue"
                    name="rentalValue"
                    placeholder=" "
                    value={formData.value}
                    onChange={handleChange}
                    text="Valor"
                  />
                  <Input
                    type={formData.rentalDate ? "date": "text"}
                    id="rentalDate"
                    name="rentalDate"
                    placeholder=" "
                    value={formData.rentalDate}
                    onChange={handleChange}
                    text="Quando começou o aluguel?"
                    onFocus={(e) => e.target.type = "date" }
                  />
                </div>
                <ButtonNextStep text={"CRIAR FINANÇA!"} />
              </div>
            }
          />
        </main>
      </div>
    </div>
  );
}
