import styles from "./EquityProgressBar.module.css";

export function EquityProgressBar({ label = "Seu Patrimônio Líquido (Equity)", percent }) {
  return (
    <div className={styles.equityBarContainer}>
      <div className={styles.equityHeader}>
        <span className={styles.equityLabel}>{label}</span>
        <strong className={styles.equityValue}>{percent.toFixed(1)}%</strong>
      </div>
      <div className={styles.progressBarTrack}>
        <div className={styles.progressBarFill} style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}></div>
      </div>
    </div>
  );
}
