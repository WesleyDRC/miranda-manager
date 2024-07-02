import styles from "./FunctionalityCard.module.css"
import { Link } from "react-router-dom";

export function FunctionalityCard({path, icon, alt, name}) {
  return (
    <Link to={path} className={styles.functionalityCard}>
      <div className={styles.icon}>
        <img src={icon} alt={alt} />
      </div>
      <p className={styles.name}>{name}</p>
    </Link>
  );
}
