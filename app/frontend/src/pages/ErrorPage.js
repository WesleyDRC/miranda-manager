import { Header } from "../components/authentication/Header";
import styles from "./ErrorPage.module.css";
import { useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <>
      <Header />
      <div className={styles.content}>
        <h1> Oops! </h1>
        <p> Desculpe, ocorreu um erro inesperado.</p>

				<Link to="/" className={styles.btn}> Voltar </Link>
      </div>
    </>
  );
}
