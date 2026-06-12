import { useState } from "react";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";
import styles from "./EditableDataRow.module.css";
import priceBRL from "../../utils/formatPrice";

export function EditableDataRow({ label, initialValue, isCurrency, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue || "");

  const handleSave = async () => {
    const finalVal = isCurrency ? Number(value) : value;
    await onSave(finalVal);
    setIsEditing(false);
  };

  return (
    <div className={styles.dataRow}>
      {label && <span className={styles.dataLabel}>{label}</span>}
      {isEditing ? (
        <div className={styles.editInputWrapper} style={{ width: label ? "auto" : "100%", justifyContent: label ? "flex-end" : "space-between" }}>
          <input 
            type={isCurrency ? "number" : "text"} 
            value={value} 
            onChange={(e) => setValue(e.target.value)}
            className={styles.editInput}
            autoFocus
            placeholder={isCurrency ? "R$ 0,00" : ""}
          />
          <div className={styles.actionButtons}>
            <button className={`${styles.actionBtn} ${styles.save}`} onClick={handleSave}>
              <FiCheck size={18} />
            </button>
            <button className={`${styles.actionBtn} ${styles.cancel}`} onClick={() => { setIsEditing(false); setValue(initialValue || ""); }}>
              <FiX size={18} />
            </button>
          </div>
        </div>
      ) : (
        <strong className={styles.dataValue}>
          {isCurrency ? priceBRL(initialValue || 0) : (initialValue || "-")}
          <button className={styles.editBtn} onClick={() => { setIsEditing(true); setValue(initialValue || ""); }} title="Editar">
            <FiEdit2 size={14} />
          </button>
        </strong>
      )}
    </div>
  );
}
