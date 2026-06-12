import React from 'react';
import { Drawer } from '../../components/ui/Drawer';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDollarSign,
  FaHistory,
  FaRegClipboard,
  FaSave
} from 'react-icons/fa';
import priceBRL from '../../utils/formatPrice';
import { getMonthName } from '../../utils/formatDate';
import styles from './RentalsDrawer.module.css';

interface RentalsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRent: any;
  observationsText: string;
  setObservationsText: (val: string) => void;
  fixedExpensesArray: any[];
  setFixedExpensesArray: (val: any[]) => void;
  savingObservations: boolean;
  onSaveObservations: () => void;
  onOpenEditMonth: (monthObj: any) => void;
}

export const RentalsDrawer: React.FC<RentalsDrawerProps> = ({
  isOpen,
  onClose,
  selectedRent,
  observationsText,
  setObservationsText,
  fixedExpensesArray,
  setFixedExpensesArray,
  savingObservations,
  onSaveObservations,
  onOpenEditMonth
}) => {
  if (!selectedRent) return <Drawer isOpen={isOpen} onClose={onClose}><div/></Drawer>;

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose}
      title="Ficha do Inquilino"
      subtitle="Informações contratuais e financeiras"
    >
      {/* Profile and Property Info */}
      <section className={styles.drawerSection}>
        <div className={styles.drawerProfile}>
          <div className={styles.drawerAvatar}>
            {selectedRent.tenant.substring(0, 2).toUpperCase()}
          </div>
          <div className={styles.drawerProfileInfo}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>{selectedRent.tenant}</h3>
            <Badge variant={
              selectedRent.status === "Pago" ? "success" : 
              selectedRent.status === "Atrasado" ? "danger" : "warning"
            }>
              {selectedRent.status}
            </Badge>
          </div>
        </div>

        <div className={styles.infoList}>
          <div className={styles.infoItem}>
            <FaMapMarkerAlt className={styles.infoIcon} />
            <div>
              <strong>Imóvel</strong>
              <span>{selectedRent.street}, {selectedRent.streetNumber}</span>
            </div>
          </div>
          <div className={styles.infoItem}>
            <FaCalendarAlt className={styles.infoIcon} />
            <div>
              <strong>Início do Contrato</strong>
              <span>{selectedRent.startRental}</span>
            </div>
          </div>
          <div className={styles.infoItem}>
            <FaDollarSign className={styles.infoIcon} />
            <div>
              <strong>Valor Mensal do Aluguel</strong>
              <span>{priceBRL(parseFloat(selectedRent.value) || 0)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Individual Summary Cards */}
      <section className={styles.drawerSection}>
        <div className={styles.drawerCardsGrid}>
          <div className={styles.drawerCardMini}>
            <span>Total Recebido</span>
            <strong>{priceBRL(selectedRent.totalPaid)}</strong>
          </div>
          <div className={styles.drawerCardMini}>
            <span>Dívida Ativa</span>
            <strong className={selectedRent.totalDebt > 0 ? styles.textDebt : styles.textZeroDebt}>
              {priceBRL(selectedRent.totalDebt)}
            </strong>
          </div>
        </div>
      </section>

      {/* Historic Months */}
      <section className={styles.drawerSection}>
        <h3><FaHistory /> Histórico de Meses</h3>
        {selectedRent.months && selectedRent.months.length > 0 ? (
          <div className={styles.monthsList}>
            {selectedRent.months.map((month: any, idx: number) => {
              const nameMonth = getMonthName(month.dateMonth);
              return (
                <div key={idx} className={styles.monthCard}>
                  <div className={styles.monthCardHeader}>
                    <strong>{nameMonth}</strong>
                    <Badge variant={month.paid ? "success" : "danger"}>
                      {month.paid ? "Pago" : "Pendente"}
                    </Badge>
                  </div>
                  <div className={styles.monthCardBody}>
                    <p>Valor Esperado: <span>{priceBRL(parseFloat(selectedRent.value))}</span></p>
                    {month.amountPaid > 0 && (
                      <p>Valor Recebido: <span>{priceBRL(month.amountPaid)}</span></p>
                    )}
                    {!month.paid && month.difference > 0 && (
                      <p className={styles.textDebt}>Diferença: <span>-{priceBRL(month.difference)}</span></p>
                    )}
                  </div>
                  <div className={styles.monthCardFooter}>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => onOpenEditMonth(month)}
                    >
                      Editar Mês
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className={styles.noDataText}>Nenhum histórico registrado para este contrato.</p>
        )}
      </section>

      {/* Fixed Expenses */}
      <section className={styles.drawerSection}>
        <h3><FaDollarSign /> Gastos Fixos</h3>
        {fixedExpensesArray.map((expense, index) => (
          <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input
              style={{ flex: 1, padding: "8px", borderRadius: "5px", border: "1px solid #334155", backgroundColor: "#1E293B", color: "#F8FAFC" }}
              placeholder="Motivo (Ex: Água)"
              value={expense.reason}
              onChange={(e) => {
                const updated = [...fixedExpensesArray];
                updated[index].reason = e.target.value;
                setFixedExpensesArray(updated);
              }}
            />
            <input
              style={{ flex: 1, padding: "8px", borderRadius: "5px", border: "1px solid #334155", backgroundColor: "#1E293B", color: "#F8FAFC" }}
              placeholder="Valor"
              type="number"
              value={expense.amount}
              onChange={(e) => {
                const updated = [...fixedExpensesArray];
                updated[index].amount = e.target.value;
                setFixedExpensesArray(updated);
              }}
            />
            <button
              type="button"
              onClick={() => {
                const updated = [...fixedExpensesArray];
                updated.splice(index, 1);
                setFixedExpensesArray(updated);
              }}
              style={{ padding: "8px 12px", borderRadius: "5px", border: "none", backgroundColor: "#EF4444", color: "#fff", cursor: "pointer", fontWeight: "bold" }}
            >
              X
            </button>
          </div>
        ))}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
            <button
              type="button"
              onClick={() => setFixedExpensesArray([...fixedExpensesArray, { reason: "", amount: "" }])}
              style={{ padding: "8px 16px", borderRadius: "5px", border: "1px dashed #64748B", backgroundColor: "transparent", color: "#94A3B8", cursor: "pointer", fontSize: "14px" }}
            >
              + Adicionar Gasto Fixo
            </button>
          </div>
      </section>

      {/* Observations */}
      <section className={styles.drawerSection}>
        <h3><FaRegClipboard /> Observações Gerais</h3>
        <textarea
          className={styles.obsTextarea}
          rows={4}
          placeholder="Adicione notas sobre o inquilino, acordos ou pendências..."
          value={observationsText}
          onChange={(e) => setObservationsText(e.target.value)}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
          <Button 
            variant="primary" 
            onClick={onSaveObservations} 
            disabled={savingObservations}
          >
            {savingObservations ? 'Salvando...' : <><FaSave style={{ marginRight: '8px' }}/> Salvar Alterações</>}
          </Button>
        </div>
      </section>
    </Drawer>
  );
};
