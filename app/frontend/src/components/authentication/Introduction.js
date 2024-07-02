import styles from "./Introduction.module.css"

export function Introduction() {
  return (
    <section className={styles.introduction}>
      <h1>
        Miranda <span> Manager </span>
      </h1>
      <p> Faça parte e veja como anda seus gastos e ganhos atualmente! </p>
    </section>
  );
}
