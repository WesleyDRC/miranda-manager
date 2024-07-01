import styles from "./Input.module.css";

export function Input() {
  return (
    <div className={styles.formGroup}>
      <input
        type="email"
        id="email"
        name="email"
        className={styles.formControl}
        required
        placeholder=" "
      />
      <label for="email" className={styles.formLabel}>
        Email
      </label>
    </div>
  );
}
