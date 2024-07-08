import styles from "./CreateCategory.module.css";

import { Input } from "../components/createFinance/Input";
import { ButtonNextStep } from "../components/createFinance/ButtonNextStep";

import AxiosRepository from "../repository/AxiosRepository";

import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function CreateCategory() {

  const [nameCategory, setNameCategory] = useState("")

  let navigate = useNavigate()

  const createNewCategory = async () => {
    const category = await AxiosRepository.createCategory({name: nameCategory})

    navigate("/dashboard")
  }
 
  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <h2 className={styles.title}>Criar Categoria</h2>
        <Input 
          text="Nome da categoria" 
          placeholder=" " 
          value={nameCategory}
          onChange={(e) => setNameCategory(e.target.value)}
        />

        <ButtonNextStep text="CRIAR!" onClick={createNewCategory}/>
      </section>
    </main>
  );
}
