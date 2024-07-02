import styles from "./Authentication.module.css";

import { Header } from "../components/authentication/Header";
import { Introduction } from "../components/authentication/Introduction";
import { Auth } from "../components/authentication/Auth";

export function Authentication() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <Introduction />
        <Auth />
      </main>
    </>
  );
}
