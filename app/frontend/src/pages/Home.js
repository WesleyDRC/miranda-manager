import styles from "./Home.module.css";

import { Header } from "../components/home/Header";
import { Introduction } from "../components/home/Introduction";
import { Auth } from "../components/home/Auth";

export function Home() {
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
