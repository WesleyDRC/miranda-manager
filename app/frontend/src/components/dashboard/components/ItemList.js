import styles from "./ItemList.module.css";

import { Link } from "react-router-dom"

export function ItemList({ path, icon, alt, onClick, label, isExpanded }) {
  return (
    <li onClick={onClick} className={`${styles.listItem} ${isExpanded ? styles.expanded : ""}`}>
      <Link to={path} className={styles.link}>
        <div className={styles.iconContainer}>
          {typeof icon === "string" ? (
            <img className={styles.icon} src={icon} alt={alt} />
          ) : (
            icon
          )}
        </div>
        {label && (
          <span className={`${styles.label} ${isExpanded ? styles.labelVisible : ""}`}>
            {label}
          </span>
        )}
      </Link>
    </li>
  );
}
