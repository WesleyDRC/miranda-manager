import styles from "./Input.module.css";

export function Input(props) {
  return (
    <div className={styles.formGroup}>
      <input {...props} className={styles.formControl} />
      <label htmlFor={props.id} className={styles.formLabel}>
        Email
      </label>
    </div>
  );
}
