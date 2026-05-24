import styles from "./DashboardChart.module.css";

export function DashboardChart({ title, subtitle, children, minHeight = 300 }) {
  return (
    <article className={styles.chartCard}>
      <header className={styles.header}>
        <div>
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </header>
      <div className={styles.chartArea} style={{ minHeight }}>
        {children}
      </div>
    </article>
  );
}
