import styles from "./ListItem.module.css"

export function ListItem({ item, type, activaTab, setActivaTab }) {
  return (
    <li
      className={`${styles.item} ${
        activaTab === type ? styles.active : ""
      }`}
      onClick={() => setActivaTab(type)}
    >
      {item}
    </li>
  );
}
