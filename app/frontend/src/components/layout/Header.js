import styles from "./Header.module.css";
import { ProfileCard } from "../dashboard/components/ProfileCard";
import { useAuth } from "../../hooks/useAuth";

export function Header({ toggleMobileMenu }) {
  const { userEmail } = useAuth();
  const username = userEmail ? userEmail.split("@")[0] : "Usuário";

  return (
    <header className={styles.header}>
      <button className={styles.hamburger} onClick={toggleMobileMenu} aria-label="Menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      <div className={styles.profileWrapper}>
        <ProfileCard username={username}/>
      </div>
    </header>
  );
}
