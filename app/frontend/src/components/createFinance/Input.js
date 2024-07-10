import React from "react";
import styles from "./Input.module.css";

export const Input = React.forwardRef((props, ref) => {
  const { customClass, ...propsInput } = props;

  return (
    <div className={`${styles.formGroup} ${styles[customClass]}`}>
      <input ref={ref} {...propsInput} className={styles.formControl} />
      <label htmlFor={props.id} className={styles.formLabel}>
        {props.text}
      </label>
    </div>
  );
});

