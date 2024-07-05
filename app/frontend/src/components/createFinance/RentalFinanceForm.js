import styles from "./RentalFinanceForm.module.css";

import { Input } from "./Input";
import { ButtonNextStep } from "./ButtonNextStep";

import { useState } from "react";

export function RentalFinanceForm() {
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
    <form>
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
            customClass="streetNumber"
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
          type={formData.rentalDate ? "date" : "text"}
          id="rentalDate"
          name="rentalDate"
          placeholder=" "
          value={formData.rentalDate}
          onChange={handleChange}
          text="Quando começou o aluguel?"
          onFocus={(e) => (e.target.type = "date")}
        />
      </div>
      <ButtonNextStep text={"CRIAR FINANÇA!"} />
    </form>
  );
}
