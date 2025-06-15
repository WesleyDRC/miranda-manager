import styles from "./Auth.module.css";

import { FormSignIn } from "./components/FormSignIn";

import { useState } from "react";
import { FormSignUp } from "./components/FormSignUp";
import { ListItem } from "./components/ListItem";

export function Auth() {
  const [activeTab, setActiveTab] = useState("signIn");

  return (
    <section className={styles.auth}>
      <nav className={styles.nav}>
        <ul className={styles.list}>
          <ListItem item="Entrar" type={"signIn"} activeTab={activeTab} setActiveTab={setActiveTab}/>
          <ListItem item="Cadastrar" type={"signUp"} activeTab={activeTab} setActiveTab={setActiveTab}/>
        </ul>
      </nav>

      {activeTab === "signIn" && (
        <FormSignIn />
      )}

      {activeTab === "signUp" && (
        <FormSignUp setActiveTab={setActiveTab}/>
      )}
    </section>
  );
}
