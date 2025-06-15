import styles from "./FormSignIn.module.css";

import { Input } from "./Input";

import { InputPassword } from "./InputPassword";
import { FormButton } from "./FormButton";

import { useAuth } from "../../../hooks/useAuth";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

export function FormSignIn() {
  const { SignIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  let navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Preencha todos os campos!");
      return;
    }

    const logonErrors = await SignIn(email, password);

    if (logonErrors) {
      setError(logonErrors);
      return;
    }
    
    toast.success("Seja bem-vindo!")
    navigate("/dashboard");
  };

  return (
    <form className={styles.formAuth} onSubmit={(e) => submit(e)}>
      <Input
        type="email"
        id="email"
        name="email"
        placeholder=" "
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />
      <InputPassword
        id="password"
        placeholder=" "
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      {error && <div className={`${styles.error} ${!error ? styles.hidden : ""}`}>{error}</div>}
      <FormButton type="submit" text="Entrar" />
    </form>
  );
}
