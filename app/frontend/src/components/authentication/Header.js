import styles from "./Header.module.css";

import logo from "../../assets/logo-w318-h200.png";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} alt="Logo Miranda Manager" />
      </div>
    </header>
  );
}
