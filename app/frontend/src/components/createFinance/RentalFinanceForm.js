import styles from "./RentalFinanceForm.module.css";

import { Input } from "./Input";
import { ButtonNextStep } from "./ButtonNextStep";

import { formatDate } from "../../utils/formatHour";

import AxiosRepository from "../../repository/AxiosRepository";

import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { ErrorMessage } from "@hookform/error-message";
import { useNavigate } from "react-router-dom"

import Joi from "joi";

export function RentalFinanceForm({ selectedOption }) {

  const navigate = useNavigate()

  const financeSchema = Joi.object({
    financeName: Joi.string().min(3).required().messages({
      "string.empty": "Insira o nome da finança!",
      "string.min": "Insira pelo menos 3 caracteres!",
      "any.required": "Insira o nome da finança!",
    }),
    street: Joi.string().min(3).required().messages({
      "string.empty": "Insira o nome da rua!",
      "string.min": "Insira pelo menos 3 caracteres!",
      "any.required": "Insira o nome da rua!",
    }),
    number: Joi.string().min(1).required().messages({
      "string.empty": "Insira o número do endereço!",
      "string.min": "Insira pelo menos 1 caractere!",
      "any.required": "Insira o número do endereço!",
    }),
    value: Joi.string().min(1).required().messages({
      "string.empty": "Insira o valor do aluguel!",
      "string.min": "Insira pelo menos 1 caractere!",
      "any.required": "Insira o valor do aluguel!",
    }),
    startRental: Joi.date().required().messages({
      "any.required": "Insira a data que começou o aluguel!",
      "date.empty": "Insira a data que começou o aluguel!",
      "date.base": "Insira a data que começou o aluguel!",
    }),
    tenant: Joi.string().min(3).required().messages({
      "string.empty": "Insira o nome do inquilino!",
      "string.min": "Insira pelo menos 3 caracteres!",
      "any.required": "Insira o nome do inquilino!",
    }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: joiResolver(financeSchema),
  });

  const onSubmit = async (data) => {

    const monthDate = formatDate(data.startRental)

    const response = await AxiosRepository.createFinance({
      name: data.financeName,
      categoryId: selectedOption,
      rentalName: data.tenant,
      rentalValue: data.value,
      rentalStreet: data.street,
      rentalStreetNumber: data.number,
      startRental: monthDate
    })

    navigate("/dashboard")
  };

  const renderErrorForm = (fieldName) => {
    return (
      <ErrorMessage
        errors={errors}
        name={fieldName}
        render={({ message }) => (
          <p className={styles.errorMessage}>{message}</p>
        )}
      />
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.fields}>
        <Input
          id="financeName"
          name="financeName"
          placeholder=" "
          text="Nome da finança"
          {...register("financeName")}
        />

        {renderErrorForm("financeName")}

        <div className={styles.streetAndNumber}>
          <Input
            id="rentalStreet"
            name="street"
            placeholder=" "
            text="Rua"
            {...register("street")}
          />
          <Input
            id="rentalNumber"
            name="number"
            placeholder=" "
            text="N°"
            customClass="streetNumber"
            {...register("number")}
          />
        </div>
        {renderErrorForm("street")}
        {renderErrorForm("streetNumber")}
        <Input
          id="rentalValue"
          name="value"
          placeholder=" "
          text="Valor"
          {...register("value")}
        />
        {renderErrorForm("value")}
        <Input
          type="date"
          id="startRental"
          placeholder=" "
          text="Quando começou o aluguel?"
          {...register("startRental")}
        />
        {renderErrorForm("startRental")}
        <Input
          type="text"
          id="tenant"
          placeholder=" "
          text="Nome do inquilino"
          {...register("tenant")}
        />
        {renderErrorForm("tenant")}
      </div>

      <ButtonNextStep
        type="submit"
        text={"CRIAR FINANÇA!"}
      />
    </form>
  );
}
