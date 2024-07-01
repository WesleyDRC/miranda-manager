import styles from "./FormButton.module.css"

export function FormButton() {
  return (
    <button type="submit" className={styles.btn}>
      Entrar
    </button>
  );
}
