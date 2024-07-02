import styles from "./Header.module.css";

import { ProfileCard } from "./components/ProfileCard";

export function Header() {
  return (
    <header className={styles.header}>
      <ProfileCard username={"Wesley Luis"}/>
    </header>
  );
}
