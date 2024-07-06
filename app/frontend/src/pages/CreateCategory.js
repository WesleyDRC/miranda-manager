import styles from "./CreateCategory.module.css";

import { Input } from "../components/createFinance/Input";
import { ButtonNextStep } from "../components/createFinance/ButtonNextStep";

export function CreateCategory() {
  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <h2 className={styles.title}>Criar Categoria</h2>
        <Input text="Nome da categoria" placeholder=" " />

        <ButtonNextStep text="CRIAR!" />
      </section>
    </main>
  );
}
