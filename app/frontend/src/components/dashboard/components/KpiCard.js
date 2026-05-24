import styles from "./KpiCard.module.css";

export function KpiCard({ icon, label, value, subtitle, variant = "default" }) {
  return (
    <article className={`${styles.card} ${styles[variant]}`}>
      <div className={styles.iconContainer}>
        <span className={styles.icon}>{icon}</span>
      </div>
      <div className={styles.content}>
        <span className={styles.label}>{label}</span>
        <h3 className={styles.value}>{value}</h3>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
      <div className={styles.glow} />
    </article>
  );
}
