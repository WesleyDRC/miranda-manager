import { useRef } from "react";
import { FiUploadCloud, FiFileText } from "react-icons/fi";
import { EditableDataRow } from "./EditableDataRow";
import styles from "./ExpenseCard.module.css";

export function ExpenseCard({ title, subtitle, status, onToggleStatus, value, onSaveValue, attachmentUrl, onFileSelect }) {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className={styles.expenseCard}>
      <div className={styles.expenseHeader}>
        <div>
          <h4 className={styles.expenseTitle}>{title}</h4>
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          {status && (
            <div className={styles.statusWrapper}>
              <span className={`${styles.statusBadge} ${status === 'PAID' ? styles.paid : styles.pending}`}>
                {status === 'PAID' ? "✓ PAGO ESTE ANO" : "PENDENTE"}
              </span>
              <button 
                className={styles.toggleBtn}
                style={{ color: status === 'PAID' ? "#ef4444" : "#10b981", borderColor: "currentColor" }}
                onClick={onToggleStatus}
              >
                {status === 'PAID' ? "Desmarcar" : "Marcar Pago"}
              </button>
            </div>
          )}
        </div>
        <div className={styles.valueWrapper}>
          <EditableDataRow 
            label="" 
            initialValue={value} 
            isCurrency={true} 
            onSave={onSaveValue} 
          />
        </div>
      </div>
      <div className={styles.attachmentSection}>
        <input type="file" ref={inputRef} style={{ display: "none" }} onChange={handleFileChange} />
        {attachmentUrl ? (
          <div className={styles.attachmentActions}>
            <button onClick={() => inputRef.current?.click()} className={styles.attachmentBtn}>
              <FiUploadCloud size={16} /> Trocar Anexo
            </button>
            <a href={attachmentUrl} target="_blank" rel="noreferrer" className={styles.viewAttachmentBtn}>
              <FiFileText size={16} /> Ver Anexo
            </a>
          </div>
        ) : (
          <button onClick={() => inputRef.current?.click()} className={styles.attachmentBtn}>
            <FiUploadCloud size={16} /> Anexar Documento
          </button>
        )}
      </div>
    </div>
  );
}
