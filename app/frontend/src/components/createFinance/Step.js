import styles from "./Step.module.css";

import { Subtitle } from "./Subtitle";

import purpleArrow from "../../assets/purple-arrow.svg";

export function Step({ title, step, children, text, previousStep}) {
  return (
    <section className={styles.section}>
      <div className={styles.title}>
        <h2>{title}</h2>
        {parseInt(step) >= 2 ? (
          <div className={styles.back} onClick={previousStep}>
            <img src={purpleArrow} alt="Purple Arrow Back"/>
            <p> Voltar </p>
          </div>
        ) : (
          null
        )}
      </div>
      <Subtitle step={step} text={text} />
      <div className={styles.cards}>{children}</div>
    </section>
  );
}
