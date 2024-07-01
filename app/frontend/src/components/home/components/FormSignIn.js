import styles from "./FormSignIn.module.css";

import { Input } from "./Input";

import { InputPassword } from "./InputPassword";
import { FormButton } from "./FormButton";

import AxiosRepository from "../../../repository/AxiosRepository";


export function FormSignIn() {
  return (
    <form className={styles.formAuth}>
      <Input
        type="email"
        id="email"
        name="email"
        placeholder=" "
      />
      <InputPassword
        id="password"
        placeholder=" "
      />
      <FormButton 
        type="submit"
        text="Cadastrar"
      />
    </form>
  );
}
