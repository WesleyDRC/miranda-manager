import styles from "./InputPassword.module.css";

import { useState } from "react";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"

export function InputPassword() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className={`${styles.formGroup} ${styles.passwordWrapper}`}>
      <input
        type={passwordVisible ? "text" : "password"}
        id="password"
        className={styles.formControl}
        required
        placeholder=" "
      />
      <label htmlFor="password" className={styles.formLabel}>
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
