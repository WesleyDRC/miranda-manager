import styles from "./FormSignUp.module.css";

import { Input } from "./Input";
import { InputPassword } from "./InputPassword";
import { FormButton } from "./FormButton";

import { useAuth } from "../../../hooks/useAuth";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function FormSignUp() {
  const { SignUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(" ");

  let navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setError("Preencha todos os campos!");
      return;
    }

    const createUserErrors = await SignUp(email, password, confirmPassword);

    if (createUserErrors) {
      setError(createUserErrors);
      console.log("createUserErrors");
      console.log(createUserErrors)
      return;
    }

    navigate("/");
  };

  return (
    <form className={styles.formAuth} onSubmit={(e) => submit(e)}>
      <Input
        type="email"
        id="email"
        name="email"
        required
        placeholder=" "
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputPassword
        id="password"
        required
        placeholder=" "
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <InputPassword
        id="confirmPassword"
        required
        placeholder=" "
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <FormButton 
        type="submit" 
        text="Cadastrar" 
      />
      {error && <div className={`${styles.error} ${!error ? styles.hidden : ""}`}>{error}</div>}
    </form>
  );
}
