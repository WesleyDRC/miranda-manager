import styles from "./Header.module.css";

import { ProfileCard } from "../dashboard/components/ProfileCard";

export function Header() {
  return (
    <header className={styles.header}>
      <ProfileCard username={"Wesley Luis"}/>
    </header>
  );
}
