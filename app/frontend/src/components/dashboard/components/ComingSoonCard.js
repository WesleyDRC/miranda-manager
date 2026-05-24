import styles from "./ComingSoonCard.module.css";

export function ComingSoonCard({ icon, title, description }) {
  return (
    <article className={styles.card}>
      <div className={styles.iconContainer}>
        <span className={styles.icon}>{icon}</span>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
      <span className={styles.badge}>Em breve</span>
    </article>
  );
}
