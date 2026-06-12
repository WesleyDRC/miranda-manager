import styles from "./RentalFinanceForm.module.css";

import { Input } from "./Input";
import { ButtonNextStep } from "./ButtonNextStep";

import { formatDate } from "../../utils/formatHour";

import AxiosRepository from "../../repository/AxiosRepository";

import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { ErrorMessage } from "@hookform/error-message";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

import Joi from "joi";

export function RentalFinanceForm({ selectedOption }) {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [fixedExpenses, setFixedExpenses] = useState([]);

  const handleAddExpense = () => {
    setFixedExpenses([...fixedExpenses, { reason: "", amount: "" }]);
  };

  const handleRemoveExpense = (index) => {
    const updated = [...fixedExpenses];
    updated.splice(index, 1);
    setFixedExpenses(updated);
  };

  const handleExpenseChange = (index, field, value) => {
    const updated = [...fixedExpenses];
    updated[index][field] = value;
    setFixedExpenses(updated);
  };

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
    try {
      const monthDate = formatDate(data.startRental);


      const formattedExpenses = fixedExpenses
        .filter(exp => exp.reason && exp.amount)
        .map(exp => ({ reason: exp.reason, amount: parseFloat(exp.amount) }));

      const response = await AxiosRepository.createFinance({
        name: data.financeName,
        category: selectedOption,
        tenant: data.tenant,
        rentalValue: data.value,
        rentalStreet: data.street,
        rentalStreetNumber: data.number,
        startRental: monthDate,
        fixedExpenses: formattedExpenses,
      });

      navigate("/dashboard");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        setError("Ocorreu um erro ao criar a finança.");
        toast.error("Ocorreu um erro ao criar a finança.")
      }
    }
  };

  const renderErrorForm = (fieldName) => {
    return (
      <ErrorMessage
        errors={errors}
        name={fieldName}
        render={({ message }) => <p className={styles.errorMessage}>{message}</p>}
      />
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <p className={styles.apiError}>{error}</p>}

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
        <Input id="rentalValue" name="value" placeholder=" " text="Valor" {...register("value")} />
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

        <div style={{ marginTop: "20px" }}>
          <h4 style={{ color: "#fff", marginBottom: "10px", fontSize: "14px" }}>Gastos Fixos (Água, Luz, etc.)</h4>
          {fixedExpenses.map((expense, index) => (
            <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <input
                style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "none", backgroundColor: "#fff", color: "#000" }}
                placeholder="Motivo (Ex: Água)"
                value={expense.reason}
                onChange={(e) => handleExpenseChange(index, "reason", e.target.value)}
              />
              <input
                style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "none", backgroundColor: "#fff", color: "#000" }}
                placeholder="Valor (Ex: 100)"
                type="number"
                value={expense.amount}
                onChange={(e) => handleExpenseChange(index, "amount", e.target.value)}
              />
              <button
                type="button"
                onClick={() => handleRemoveExpense(index)}
                style={{ padding: "10px 15px", borderRadius: "5px", border: "none", backgroundColor: "#ff4d4f", color: "#fff", cursor: "pointer", fontWeight: "bold" }}
              >
                X
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddExpense}
            style={{ padding: "10px", borderRadius: "5px", border: "1px dashed #ccc", backgroundColor: "transparent", color: "#ccc", cursor: "pointer", width: "100%", marginBottom: "10px", fontSize: "14px" }}
          >
            + Adicionar Gasto Fixo
          </button>
        </div>
      </div>

      <ButtonNextStep type="submit" text={"CRIAR FINANÇA!"} />
    </form>
  );
}
