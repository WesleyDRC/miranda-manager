import styles from "./FormSignIn.module.css";

import { Input } from "./Input";

import { InputPassword } from "./InputPassword";
import { FormButton } from "./FormButton";

export function FormSignUp() {
  return (
    <form className={styles.formAuth}>
      <Input
        type="email"
        id="email"
        name="email"
        required
        placeholder=" "
      />
      <InputPassword
        id="password"
        required
        placeholder=" "
      />
      <InputPassword
        id="confirmPassword"
        required
        placeholder=" "
      />
      <FormButton />
    </form>
  );
}
