import styles from "./ButtonNextStep.module.css"

import arrowPurple from "../../assets/purple-arrow.svg"

export function ButtonNextStep() {
  return (
    <button className={styles.button}>
      Próxima etapa
      <span className={styles.arrow}>
        <img src={arrowPurple} alt="Purple Arrow" />
      </span>
    </button>
  );
}
