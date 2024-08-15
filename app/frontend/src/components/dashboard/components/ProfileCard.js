import styles from "./ProfileCard.module.css";

import userIcon from "../../../assets/user.svg";
import settinsIcon from "../../../assets/settings-disabled.svg";
import leaveIcon from "../../../assets/leave-icon.svg";

import { useAuth } from "../../../hooks/useAuth";

import { useState, useEffect, useRef} from "react";

export function ProfileCard({ userPhoto, username }) {
  const [showDropDown, setShowDropDown] = useState(false);

  const { SignOut } = useAuth();

  const showProfileDropdown = () => {
    setShowDropDown(!showDropDown);
  };

  const profileCardRef = useRef(null)

  const handleClickOutside = (event) => {
    if (profileCardRef.current && !profileCardRef.current.contains(event.target)) {
      setShowDropDown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div
      className={`${styles.user} ${showDropDown ? styles.clicked : ""}`}
      onClick={showProfileDropdown}
      ref={profileCardRef}
    >
      <span className={styles.username}> {username} </span>
      <div className={styles.photo}>
        <img src={userPhoto ? userPhoto : userIcon} alt="Foto do usuário" />
      </div>

      {showDropDown && (
        <div className={styles.dropDown}>
          <ul className={styles.list}>
            <li className={styles.item}>
              <img src={settinsIcon} alt="Settings Icon" />
              <span>Configurações </span>
            </li>
            <li className={styles.item} onClick={SignOut}>
              <img src={leaveIcon} alt="Leave Icon" />
              <span> Sair</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
