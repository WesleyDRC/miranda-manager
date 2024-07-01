import styles from "./FormSignIn.module.css";

import { Input } from "./Input";

import { InputPassword } from "./InputPassword";
import { FormButton } from "./FormButton";

export function FormSignUp() {
  return (
    <form className={styles.formAuth}>
      <Input />
      <InputPassword />
      <InputPassword />
      <FormButton />
    </form>
  );
}
