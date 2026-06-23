import React from 'react';
import priceBRL from '../../utils/formatPrice';
import { Badge } from '../../components/ui/Badge';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import styles from './ForecastTimeline.module.css';

interface ForecastMonthCardProps {
  month: any;
  isExpanded: boolean;
  onToggle: (date: string | null) => void;
}

const ForecastMonthCardComponent: React.FC<ForecastMonthCardProps> = ({ month, isExpanded, onToggle }) => {
  const isNegative = month.projectedBalance < 0;

  return (
    <div className={styles.cardContainer} style={{ border: `1px solid ${isExpanded ? '#5E17EB' : '#E2E8F0'}`, background: isExpanded ? '#F8FAFC' : 'white' }}>
      <div 
        onClick={() => onToggle(isExpanded ? null : month.date)}
        className={`${styles.cardHeader} ${isExpanded ? styles.cardHeaderExpanded : ''}`}
      >
        <div className={styles.cardHeaderTitleBox}>
          {isExpanded ? <FaChevronUp color="#5E17EB" /> : <FaChevronDown color="#64748B" />}
          <strong className={styles.cardHeaderDate}>{month.date}</strong>
        </div>
        
        <div className={styles.cardHeaderIndicators}>
          <div className={styles.indicatorBox}>
            <span className={styles.indicatorLabel}>Entradas Totais</span>
            <strong className={styles.indicatorValueSuccess}>{priceBRL(month.incomes)}</strong>
          </div>
          <div className={styles.indicatorBox}>
            <span className={styles.indicatorLabel}>Saídas Totais</span>
            <strong className={styles.indicatorValueDanger}>{priceBRL(month.expenses)}</strong>
          </div>
          <div className={styles.indicatorBox}>
            <span className={styles.indicatorLabel}>Investimentos</span>
            <strong className={styles.indicatorValuePrimary}>{priceBRL(month.composition?.treasuryBalance || 0)}</strong>
            <div className={styles.indicatorSub}>
              <span className={styles.indicatorSubSuccess}>+ {priceBRL((month.composition?.treasuryDeposits || 0) + (month.composition?.treasuryYield || 0))}</span>
              {month.composition?.treasuryWithdrawals > 0 && (
                <span className={styles.indicatorSubDanger}>- {priceBRL(month.composition.treasuryWithdrawals)}</span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.cardHeaderBalanceBox}>
          <span className={styles.indicatorLabel}>Saldo Final Estimado</span>
          <strong className={isNegative ? styles.balanceValueNegative : styles.balanceValue}>{priceBRL(month.projectedBalance)}</strong>
        </div>
      </div>

      {isExpanded && (
        <div className={styles.expandedDetails}>
          <h4 className={styles.detailsTitle}>Detalhamento Contábil (DRE Projetada)</h4>
          
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeaderRow}>
                  <th className={styles.tableTh}>Categoria/Origem</th>
                  <th className={styles.tableTh}>Classificação</th>
                  <th className={styles.tableThRight}>Impacto no Caixa</th>
                </tr>
              </thead>
              <tbody>
                {month.detailedTransactions && month.detailedTransactions.map((tx: any, idx: number) => (
                  <tr key={idx} className={styles.tableRow}>
                    <td className={styles.tableTdSource}>
                      {tx.source} <span className={styles.tableTdDay}>Dia {tx.day}</span>
                    </td>
                    <td className={styles.tableTdType}>
                      <Badge variant={tx.type === 'INCOME' ? 'success' : tx.type === 'EXPENSE' ? 'danger' : 'info'}>
                        {tx.type === 'INCOME' ? 'RECEITA' : tx.type === 'EXPENSE' ? 'DESPESA' : 'RENDIMENTO (EQUITY)'}
                      </Badge>
                    </td>
                    <td className={`${styles.tableTdAmount} ${tx.type === 'INCOME' ? styles.tableTdAmountSuccess : tx.type === 'EXPENSE' ? styles.tableTdAmountDanger : styles.tableTdAmountPrimary}`}>
                      {tx.type === 'INCOME' ? '+' : tx.type === 'EXPENSE' ? '-' : '+'} {priceBRL(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {month.investmentsState && month.investmentsState.length > 0 && (
            <div className={styles.investmentsSection}>
              <h4 className={styles.detailsTitle}>Posição de Investimentos (Tesouro Direto)</h4>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr className={styles.tableHeaderRow}>
                      <th className={styles.tableTh}>Ativo</th>
                      <th className={styles.tableThRight}>Saldo Acumulado no Mês (Bruto)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {month.investmentsState.map((inv: any, idx: number) => (
                      <tr key={idx} className={styles.tableRow}>
                        <td className={styles.tableTdSource}>
                          {inv.name}
                        </td>
                        <td className={`${styles.tableTdAmount} ${styles.tableTdAmountPrimary}`}>
                          {priceBRL(inv.balance)}
                        </td>
                      </tr>
                    ))}
                    <tr className={styles.investmentsTotalRow}>
                      <td className={styles.investmentsTotalLabel}>Total Acumulado (Líquido Estimado)</td>
                      <td className={styles.investmentsTotalValue}>
                        {priceBRL(month.composition?.treasuryBalance || 0)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className={styles.footerRow}>
            <div className={styles.footerBoxLeft}>
              <div className={styles.footerText}>Resultado Líquido do Mês: <strong className={(month.incomes - month.expenses) >= 0 ? styles.footerStrongSuccess : styles.footerStrongDanger}>{(month.incomes - month.expenses) >= 0 ? '+ ' : '- '}{priceBRL(Math.abs(month.incomes - month.expenses))}</strong></div>
            </div>
            <div className={styles.footerBoxRight}>
              <div className={styles.footerText}>Crescimento de Patrimônio (Equity) Adicionado: <strong className={styles.footerStrongSuccess}>+ {priceBRL((month.composition?.patrimonyInstallments || 0) + (month.composition?.treasuryYield || 0))}</strong></div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export const ForecastMonthCard = React.memo(ForecastMonthCardComponent);
