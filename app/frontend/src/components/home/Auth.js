import styles from "./Auth.module.css";

import { FormSignIn } from "./components/FormSignIn";

import { useState } from "react";
import { FormSignUp } from "./components/FormSignUp";
import { ListItem } from "./components/ListItem";

export function Auth() {
  const [activaTab, setActivaTab] = useState("signIn");

  return (
    <section className={styles.auth}>
      <nav className={styles.nav}>
        <ul className={styles.list}>
          <ListItem item="Entrar" type={"signIn"} activaTab={activaTab} setActivaTab={setActivaTab}/>
          <ListItem item="Cadastrar" type={"signUp"} activaTab={activaTab} setActivaTab={setActivaTab}/>
        </ul>
      </nav>

      {activaTab === "signIn" && (
        <FormSignIn />
      )}

      {activaTab === "signUp" && (
        <FormSignUp />
      )}
    </section>
  );
}
