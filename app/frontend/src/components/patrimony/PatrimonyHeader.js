import { FiArrowLeft } from "react-icons/fi";
import styles from "./PatrimonyHeader.module.css";

export function PatrimonyHeader({ title, onBack, rightAction, children }) {
  return (
    <header className={styles.header}>
      <button onClick={onBack} className={styles.backBtn}>
        <FiArrowLeft size={16} /> Voltar para Patrimônio
      </button>
      <div className={styles.headerContent}>
        <div>
          <div className={styles.titleWrapper}>
            <h1 className={styles.title}>{title}</h1>
          </div>
          <div className={styles.subtitle}>
            {children}
          </div>
        </div>
        {rightAction}
      </div>
    </header>
  );
}
