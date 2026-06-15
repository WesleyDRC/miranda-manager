import { useState, useRef } from "react";
import { FiUploadCloud, FiFileText, FiChevronDown, FiChevronUp, FiPlus, FiTrash2 } from "react-icons/fi";
import { EditableDataRow } from "./EditableDataRow";
import styles from "./ExpenseHistoryCard.module.css";
import priceBRL from "../../utils/formatPrice";

export function ExpenseHistoryCard({ title, subtitle, history = [], onAddHistory, onUpdateHistory, onDeleteHistory, onFileSelect }) {
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef(null);
  const [uploadTargetIndex, setUploadTargetIndex] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && uploadTargetIndex !== null) {
      onFileSelect(file, uploadTargetIndex);
      setUploadTargetIndex(null);
      e.target.value = "";
    }
  };

  const sortedHistory = [...history].sort((a, b) => b.year - a.year);
  const currentItem = sortedHistory[0];
  const restHistory = sortedHistory.slice(1);

  const renderHistoryItem = (item, indexInOriginalArray, isCurrent = false) => {
    return (
      <div key={item.year} className={`${styles.historyItem} ${isCurrent ? styles.currentItem : ''}`}>
        <div className={styles.historyHeader}>
          <div className={styles.yearCol}>
            <EditableDataRow 
              label="" 
              initialValue={item.year} 
              onSave={(val) => onUpdateHistory(indexInOriginalArray, "year", parseInt(val, 10) || val)} 
            />
          </div>
          
          <div className={styles.statusCol}>
            {item.paid !== undefined && (
              <div className={styles.statusWrapper}>
                <span className={`${styles.statusBadge} ${item.paid ? styles.paid : styles.pending}`}>
                  {item.paid ? "PAGO" : "PENDENTE"}
                </span>
                <button 
                  className={styles.toggleBtn}
                  style={{ color: item.paid ? "#ef4444" : "#10b981", borderColor: "currentColor" }}
                  onClick={() => onUpdateHistory(indexInOriginalArray, "paid", !item.paid)}
                >
                  {item.paid ? "Desmarcar" : "Marcar Pago"}
                </button>
              </div>
            )}
          </div>
          
          <div className={styles.valueCol}>
            <EditableDataRow 
              label="" 
              initialValue={item.value} 
              isCurrency={true} 
              onSave={(val) => onUpdateHistory(indexInOriginalArray, "value", val)} 
            />
          </div>
        </div>

        <div className={styles.attachmentSection}>
          {item.receiptUrl || item.policyUrl ? (
            <div className={styles.attachmentActions}>
              <button 
                onClick={() => { setUploadTargetIndex(indexInOriginalArray); inputRef.current?.click(); }} 
                className={styles.attachmentBtn}
              >
                <FiUploadCloud size={14} /> Trocar Anexo
              </button>
              <a href={item.receiptUrl || item.policyUrl} target="_blank" rel="noreferrer" className={styles.viewAttachmentBtn}>
                <FiFileText size={14} /> Ver Anexo
              </a>
            </div>
          ) : (
            <button 
              onClick={() => { setUploadTargetIndex(indexInOriginalArray); inputRef.current?.click(); }} 
              className={styles.attachmentBtn}
            >
              <FiUploadCloud size={14} /> Anexar Documento
            </button>
          )}
          <button 
            onClick={() => {
              if (window.confirm("Deseja realmente excluir este registro?")) {
                onDeleteHistory(indexInOriginalArray);
              }
            }} 
            className={styles.deleteBtn}
            title="Excluir Registro"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <h4 className={styles.title}>{title}</h4>
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        </div>
        <button onClick={onAddHistory} className={styles.addBtn}>
          <FiPlus /> Adicionar Ano
        </button>
      </div>

      <input type="file" ref={inputRef} style={{ display: "none" }} onChange={handleFileChange} />

      {history.length === 0 ? (
        <div className={styles.emptyState}>Nenhum registro encontrado.</div>
      ) : (
        <div className={styles.historyList}>
          {currentItem && renderHistoryItem(currentItem, history.findIndex(h => h.year === currentItem.year), true)}
          
          {restHistory.length > 0 && (
            <div className={styles.expandWrapper}>
              <button className={styles.expandBtn} onClick={() => setExpanded(!expanded)}>
                {expanded ? (
                  <><FiChevronUp /> Ocultar Histórico</>
                ) : (
                  <><FiChevronDown /> Ver mais ({restHistory.length})</>
                )}
              </button>
              
              {expanded && (
                <div className={styles.expandedContent}>
                  {restHistory.map(item => renderHistoryItem(item, history.findIndex(h => h.year === item.year)))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
