import styles from "./FormSignIn.module.css";

import { Input } from "./Input";

import { InputPassword } from "./InputPassword";
import { FormButton } from "./FormButton";

export function FormSignIn() {
  return (
    <form className={styles.formAuth}>
      <Input />
      <InputPassword />
      <FormButton />
    </form>
  );
}
