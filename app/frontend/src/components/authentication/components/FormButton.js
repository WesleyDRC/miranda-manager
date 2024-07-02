import styles from "./FormButton.module.css";

export function FormButton(props) {
  return (
    <button {...props} className={styles.btn}>
      {props.text}
    </button>
  );
}
