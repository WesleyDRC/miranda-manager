import styles from "./ProfileCard.module.css"

import userIcon from "../../../assets/user.svg"

export function ProfileCard({userPhoto , username}) {
  return (
    <div className={styles.user}>
			<img src={userPhoto ? userPhoto: userIcon} alt="Foto do usuário" />
      <span className={styles.username}> {username} </span>
    </div>
  );
}
