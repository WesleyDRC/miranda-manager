import styles from "./NotFound.module.css";

import React from "react";
import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className={styles.notFound}>
			<span className={styles.error}> 404</span>
      <h1>Recurso não encontrado</h1>
      <p>Desculpe, o recurso que você está procurando não existe.</p>
      <Link className={styles.btn} to="/">Voltar para a página inicial</Link>
    </div>
  );
}
