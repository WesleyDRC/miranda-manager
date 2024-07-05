import styles from "./Input.module.css";

export function Input(props) {

  const {customClass, ...propsInput} = props

  return (
    <div className={` ${styles.formGroup} ${styles[customClass]} `}>
      <input {...propsInput} className={styles.formControl} />
      <label htmlFor={props.id} className={styles.formLabel}>
        {props.text}
      </label>
    </div>
  );
}
