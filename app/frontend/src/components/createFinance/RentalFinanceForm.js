import styles from "./RentalFinanceForm.module.css";

import { Input } from "./Input";
import { ButtonNextStep } from "./ButtonNextStep";

import AxiosRepository from "../../repository/AxiosRepository";

import { useState } from "react";

export function RentalFinanceForm({selectedOption}) {
	
  const [formData, setFormData] = useState({
    financeName: "",
    street: "",
    number: "",
    value: "",
    rentalDate: "",
    tenant: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const submit =  async (e) => {

    e.preventDefault()

    console.log(selectedOption)

    const response = await AxiosRepository.createFinance({
      name: formData.financeName,
      categoryId: selectedOption,
      rentalName: formData.tenant,
      rentalValue: formData.value,
      rentalStreet: formData.street,
      rentalStreetNumber: formData.number,
      startRental: formData.startRental,
    })

    console.log("ENVIOU")

    console.log(response)

    console.log(e)
  }

  return (
    <form onSubmit={submit}>
      <div className={styles.fields}>
        <Input
          id="financeName"
          name="financeName"
          placeholder=" "
          value={formData.financeName}
          onChange={handleChange}
          text="Nome da finança"
          required
        />
        <div className={styles.streetAndNumber}>
          <Input
            id="rentalStreet"
            name="street"
            placeholder=" "
            value={formData.street}
            onChange={handleChange}
            text="Rua"
            required
          />
          <Input
            id="rentalNumber"
            name="number"
            placeholder=" "
            value={formData.number}
            onChange={handleChange}
            text="N°"
            customClass="streetNumber"
            required
          />
        </div>

        <Input
          id="rentalValue"
          name="value"
          placeholder=" "
          value={formData.value}
          onChange={handleChange}
          text="Valor"
          required
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
          required
        />
        <Input
          type="text"
          id="tenant"
          name="tenant"
          placeholder=" "
          value={formData.tenant}
          onChange={handleChange}
          text="Nome do inquilino"
          required
        />
      </div>
      <ButtonNextStep type="submit" text={"CRIAR FINANÇA!"} />
    </form>
  );
}
