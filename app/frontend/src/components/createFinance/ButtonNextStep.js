import styles from "./ButtonNextStep.module.css"

import arrowPurple from "../../assets/purple-arrow.svg"

export function ButtonNextStep(props) {
  return (
    <button {...props} className={styles.button}>
      {props.text}
      <span className={styles.arrow}>
        <img src={arrowPurple} alt="Purple Arrow" />
      </span>
    </button>
  );
}
