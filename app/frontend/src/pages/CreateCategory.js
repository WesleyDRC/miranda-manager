import styles from "./CreateCategory.module.css";

import { Sidebar } from "../components/dashboard/Sidebar";
import { Header } from "../components/dashboard/Header";

import { Input } from "../components/createFinance/Input";
import { ButtonNextStep } from "../components/createFinance/ButtonNextStep";

export function CreateCategory() {
  return (
    <div className={styles.content}>
      <Sidebar />
      <div className={styles.coreContent}>
        <Header />
        <main className={styles.main}>
          <section className={styles.section}>
            <h2 className={styles.title}>Criar Categoria</h2>
            <Input 
							text="Nome da categoria"
							placeholder=" "
						/>

            <ButtonNextStep text="CRIAR!" />
          </section>
        </main>
      </div>
    </div>
  );
}
