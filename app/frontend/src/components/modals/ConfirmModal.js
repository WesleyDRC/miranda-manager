import styles from "./ConfirmModal.module.css";

export function ConfirmModal({ title, item, onConfirm, onCancel, confirmModalClass }) {
  return (
    <div className={`${styles.modal} ${confirmModalClass ? styles[confirmModalClass] : ''}`}>
      <div className={`${styles.modalContent} ${confirmModalClass ? styles[confirmModalClass] : ''}`}>
        <header className={styles.header}>
          <h2> {title} </h2>
        </header>

        <main className={styles.main}>
          <p>{`Deseja mesmo excluir ${item}? Esta ação é irreversível.`}</p>
        </main>

        <footer className={styles.footer}>
          <button className={`${styles.btn} ${styles.btnCancel}`} onClick={onCancel}>Cancelar</button>
          <button className={`${styles.btn} ${styles.btnConfirm}`} onClick={onConfirm}>Excluir</button>
        </footer>
      </div>
    </div>
  );
}