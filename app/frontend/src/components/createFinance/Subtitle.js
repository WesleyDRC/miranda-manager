import styles from "./Subtitle.module.css";

export function Subtitle({step, text}) {
  return (
    <div className={styles.subtitle}>
      <div className={styles.circle}>
        <span className={styles.stepNumber}>{step}</span>
      </div>
      <h3 className={styles.subtitleText}>{text}</h3>
    </div>
  );
}
