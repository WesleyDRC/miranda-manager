import styles from "./Input.module.css";

export function Input(props) {
  return (
    <div className={` ${styles.formGroup} ${styles[props.customClass]} `}>
      <input {...props} className={styles.formControl} />
      <label htmlFor={props.id} className={styles.formLabel}>
        {props.text}
      </label>
    </div>
  );
}
