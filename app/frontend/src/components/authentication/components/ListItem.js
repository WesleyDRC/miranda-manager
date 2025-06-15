import styles from "./ListItem.module.css"

export function ListItem({ item, type, activeTab, setActiveTab }) {
  return (
    <li
      className={`${styles.item} ${
        activeTab === type ? styles.active : ""
      }`}
      onClick={() => setActiveTab(type)}
    >
      {item}
    </li>
  );
}
