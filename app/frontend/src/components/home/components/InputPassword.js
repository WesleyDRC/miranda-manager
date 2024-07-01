import styles from "./InputPassword.module.css";

import { useState } from "react";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export function InputPassword(props) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className={`${styles.formGroup} ${styles.passwordWrapper}`}>
      <input
        {...props}
        type={passwordVisible ? "text" : "password"}
        className={styles.formControl}
      />
      <label htmlFor={props.id} className={styles.formLabel}>
        Senha
      </label>
      <span
        className={styles.togglePassword}
        onClick={togglePasswordVisibility}
      >
        {passwordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
      </span>
    </div>
  );
}
