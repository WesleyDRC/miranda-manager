import styles from "./ModalAllPendingMonths.module.css";
import CloseIcon from "../../assets/close-icon.svg";
import { getMonthName, getYear } from "../../utils/formatDate";
import priceBRL from "../../utils/formatPrice";

export function ModalAllPendingMonths({ pendingMonths, rentValue, onEditMonth, closeModal }) {
  return (
    <div className={styles.modal} aria-labelledby="modalTitle">
      <div className={`${styles.modalContent} ${styles.slideInBottom}`}>
        <header className={styles.modalHeader}>
          <h2 className={styles.title} id="modalTitle">
            Todos os Meses Pendentes
          </h2>
          <button onClick={closeModal} className={styles.closeBtn}>
            <img className={styles.icon} src={CloseIcon} alt="Close Modal Icon" />
          </button>
        </header>

        <main className={styles.modalBody}>
          <p className={styles.subtitle}>
            Você possui <strong>{pendingMonths.length}</strong> meses com pendências financeiras.
          </p>
          <div className={styles.listContainer}>
            {pendingMonths.map((month) => {
              const amountPaid = month.amountPaid || 0;
              const difference = month.difference !== undefined ? month.difference : rentValue - amountPaid;

              return (
                <div 
                  key={month.id} 
                  className={styles.pendingItem}
                  onClick={() => {
                    closeModal();
                    if (onEditMonth) {
                      onEditMonth({
                        nameMonth: getMonthName(month.dateMonth),
                        paid: month.paid,
                        rentMonthId: month.id,
                        amountPaid: month.amountPaid
                      });
                    }
                  }}
                >
                  <div className={styles.pendingMonth}>
                    <span className={styles.pendingDot} />
                    <span className={styles.pendingName}>
                      {getMonthName(month.dateMonth)} {getYear(month.dateMonth)}
                    </span>
                  </div>
                  <div className={styles.pendingValues}>
                    <div className={styles.pendingDetail}>
                      <span className={styles.pendingLabel}>Esperado</span>
                      <span className={styles.pendingAmount}>
                        {priceBRL(rentValue)}
                      </span>
                    </div>
                    <div className={styles.pendingDetail}>
                      <span className={styles.pendingLabel}>Pago</span>
                      <span className={styles.pendingAmountPaid}>
                        {priceBRL(amountPaid)}
                      </span>
                    </div>
                    <div className={styles.pendingDetail}>
                      <span className={styles.pendingLabel}>Deve</span>
                      <span className={styles.pendingDebt}>
                        {priceBRL(difference > 0 ? difference : 0)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
