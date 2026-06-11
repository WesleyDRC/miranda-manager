import styles from "./TenantDebtSummary.module.css";

import priceBRL from "../../utils/formatPrice";
import { getMonthName, getYear } from "../../utils/formatDate";

import { FaMapMarkerAlt, FaCalendarAlt, FaUser } from "react-icons/fa";

export function TenantDebtSummary({ rentData, onEditMonth, onViewAll }) {
  if (!rentData || !rentData.months) {
    return null;
  }

  const PENDING_LIMIT = 5;

  const rentValue = parseFloat(rentData.value) || 0;
  const totalMonths = rentData.months.length;
  const pendingMonths = rentData.months.filter((m) => !m.paid);
  const paidMonthsLength = totalMonths - pendingMonths.length;

  const totalExpected = rentData.totalExpected || 0;
  const totalPaid = rentData.totalPaid || 0;
  const totalDebt = rentData.totalDebt || 0;
  const isDebtFree = rentData.isDebtFree !== undefined ? rentData.isDebtFree : totalDebt <= 0;

  const displayedPending = pendingMonths.slice(0, PENDING_LIMIT);
  const hiddenCount = pendingMonths.length - PENDING_LIMIT;

  return (
    <section className={styles.container}>
      {/* Profile and Property Info Section */}
      <div className={styles.drawerSection}>
        <div className={styles.drawerProfile}>
          <div className={styles.drawerAvatar}>
            {rentData.tenant.substring(0, 2).toUpperCase()}
          </div>
          <div className={styles.drawerProfileInfo}>
            <h3>{rentData.tenant}</h3>
            <span
              className={`${styles.statusTag} ${
                isDebtFree ? styles.tagPaid : styles.tagOverdue
              }`}
            >
              {isDebtFree ? "Em Dia" : "Pendente"}
            </span>
          </div>
        </div>

        <div className={styles.infoList}>
          <div className={styles.infoItem}>
            <FaMapMarkerAlt className={styles.infoIcon} />
            <div>
              <strong>Imóvel</strong>
              <span>{rentData.street}, {rentData.streetNumber}</span>
            </div>
          </div>
          <div className={styles.infoItem}>
            <FaCalendarAlt className={styles.infoIcon} />
            <div>
              <strong>Início do Contrato</strong>
              <span>{rentData.startRental}</span>
            </div>
          </div>
          <div className={styles.infoItem}>
            <FaUser className={styles.infoIcon} />
            <div>
              <strong>Inquilino</strong>
              <span>{rentData.tenant}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Financial Summary Grid */}
      <div className={styles.drawerSection} style={{ marginTop: "28px" }}>
        <h4 className={styles.sectionHeading}>Resumo Financeiro Individual</h4>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Aluguel mensal</span>
            <span className={styles.statValue}>{priceBRL(rentValue)}</span>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total esperado</span>
            <span className={styles.statValue}>{priceBRL(totalExpected)}</span>
            <span className={styles.statSub}>
              {totalMonths} {totalMonths === 1 ? "mês" : "meses"}
            </span>
          </div>

          <div className={`${styles.statCard} ${styles.success}`}>
            <span className={styles.statLabel}>Total recebido</span>
            <span className={styles.statValue}>{priceBRL(totalPaid)}</span>
            <span className={styles.statSub}>
              {paidMonthsLength} {paidMonthsLength === 1 ? "mês pago" : "meses pagos"}
            </span>
          </div>

          <div className={`${styles.statCard} ${isDebtFree ? styles.success : styles.danger} ${styles.highlight}`}>
            <span className={styles.statLabel}>
              {isDebtFree ? "Situação" : "Dívida acumulada"}
            </span>
            <span className={`${styles.statValue} ${styles.debtValue}`}>
              {isDebtFree ? "Em dia ✓" : priceBRL(totalDebt)}
            </span>
            {!isDebtFree && (
              <span className={styles.statSub}>
                {pendingMonths.length}{" "}
                {pendingMonths.length === 1 ? "mês pendente" : "meses pendentes"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Pending Months Section if any */}
      {pendingMonths.length > 0 && (
        <div className={styles.pendingSection} style={{ marginTop: "28px" }}>
          <h4 className={styles.sectionHeading}>Meses pendentes</h4>
          <div className={styles.pendingList}>
            {displayedPending.map((month) => {
              const amountPaid = month.amountPaid || 0;

              return (
                <div
                  key={month.id}
                  className={`${styles.pendingItem} ${styles.clickable}`}
                  onClick={() => {
                    if (onEditMonth) {
                      onEditMonth({
                        nameMonth: getMonthName(month.dateMonth),
                        paid: month.paid,
                        rentMonthId: month.id,
                        amountPaid: month.amountPaid,
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
                        {priceBRL(month.difference > 0 ? month.difference : 0)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {hiddenCount > 0 && (
            <div className={styles.hiddenCountMsg}>
              <span>+ {hiddenCount} {hiddenCount === 1 ? "mês pendente não exibido" : "meses pendentes não exibidos"}</span>
              <button className={styles.viewAllBtn} onClick={onViewAll}>
                Ver todos
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
