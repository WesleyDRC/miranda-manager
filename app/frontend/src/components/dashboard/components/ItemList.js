import styles from "./ItemList.module.css";

import { Link } from "react-router-dom"

export function ItemList({ path, icon, alt}) {
  return (
    <li>
      <Link to={path}>
				<img className={styles.icon} src={icon} alt={alt} />
      </Link>
    </li>
  );
}
