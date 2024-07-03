import styles from "./Subtitle.module.css";

export function Subtitle() {
  return (
    <div className={styles.subtitle}>
      <div className={styles.circle}>
        <span className={styles.stepNumber}>1</span>
      </div>
      <span className={styles.subtitleText}>Selecione o tipo da finança</span>
    </div>
  );
}
