import React from 'react';
import axiosRepositoryInstance from '../../repository/AxiosRepository';
import { toast } from 'react-toastify';
import priceBRL from '../../utils/formatPrice';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import styles from '../ForecastDashboard.module.css';

interface MonthlyStatementProps {
  statementDate: Date;
  setStatementDate: React.Dispatch<React.SetStateAction<Date>>;
  transactions: any[];
  editingTx: any;
  setEditingTx: (tx: any) => void;
  mockUpload: string;
  setMockUpload: (val: string) => void;
  onTransactionUpdated: () => void;
}

export const MonthlyStatement: React.FC<MonthlyStatementProps> = ({
  statementDate,
  setStatementDate,
  transactions,
  editingTx,
  setEditingTx,
  mockUpload,
  setMockUpload,
  onTransactionUpdated
}) => {
  const handlePrevMonth = () => {
    setStatementDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setStatementDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const statementTransactions = transactions.filter(t => {
    const d = new Date(t.dueDate);
    return d.getMonth() === statementDate.getMonth() && d.getFullYear() === statementDate.getFullYear();
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const statementIncomes = statementTransactions.filter(t => t.type === 'INCOME');
  const statementExpenses = statementTransactions.filter(t => t.type === 'EXPENSE');
  const totalIncomes = statementIncomes.reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = statementExpenses.reduce((acc, t) => acc + t.amount, 0);
  const saldo = totalIncomes - totalExpenses;

  return (
    <section className={styles.chartSection}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3>Extrato Mensal</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#F1F5F9', padding: '8px 16px', borderRadius: '8px' }}>
          <button onClick={handlePrevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>&lt;</button>
          <input 
            type="month" 
            value={`${statementDate.getFullYear()}-${String(statementDate.getMonth() + 1).padStart(2, '0')}`}
            onChange={(e) => {
              if (e.target.value) {
                const [y, m] = e.target.value.split('-');
                setStatementDate(new Date(Number(y), Number(m) - 1, 1));
              }
            }}
            style={{ background: 'none', border: 'none', fontWeight: 'bold', fontSize: '16px', outline: 'none', fontFamily: 'inherit' }}
          />
          <button onClick={handleNextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>&gt;</button>
        </div>
      </div>

      {editingTx ? (
        <form onSubmit={async (e: any) => {
          e.preventDefault();
          try {
            const amount = e.target.amount.value;
            await axiosRepositoryInstance.updateTransaction(editingTx.id, {
              amount: Number(amount)
            });
            toast.success('Lançamento atualizado para este mês!');
            setEditingTx(null);
            setMockUpload('');
            onTransactionUpdated();
          } catch (err) {
            toast.error('Erro ao atualizar transação');
          }
        }} style={{ background: '#F8FAFC', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
          <h4>Editando Lançamento: {editingTx.description}</h4>
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <Input name="amount" label="Valor Físico (R$)" type="number" step="0.01" defaultValue={editingTx.amount} />
              <span style={{ fontSize: '12px', color: '#64748B' }}>Altere o valor especificamente para este mês.</span>
            </div>
            <div style={{ flex: 1 }}>
              <Input label="Anexar Comprovante (Opcional)" type="file" accept=".pdf,image/png,image/jpeg" onChange={(e: any) => setMockUpload(e.target.value)} style={{ background: 'white' }} />
            </div>
          </div>
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <Button type="submit" variant="primary">Salvar Alteração Mês</Button>
            <Button type="button" variant="secondary" onClick={() => setEditingTx(null)}>Cancelar</Button>
          </div>
        </form>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {statementTransactions.length === 0 ? (
            <div style={{ color: '#64748B', textAlign: 'center', padding: '40px' }}>Nenhuma transação para este mês.</div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, background: '#F0FDF4', padding: '16px', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                  <div style={{ fontSize: '14px', color: '#166534' }}>Total Entradas</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#15803D' }}>{priceBRL(totalIncomes)}</div>
                </div>
                <div style={{ flex: 1, background: '#FEF2F2', padding: '16px', borderRadius: '8px', border: '1px solid #FECACA' }}>
                  <div style={{ fontSize: '14px', color: '#991B1B' }}>Total Saídas</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#B91C1C' }}>{priceBRL(totalExpenses)}</div>
                </div>
                <div style={{ flex: 1, background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '14px', color: '#1E293B' }}>Saldo Projetado</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: saldo >= 0 ? '#10B981' : '#EF4444' }}>{priceBRL(saldo)}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {statementTransactions.map((tx, idx) => {
                  const isIncome = tx.type === 'INCOME';
                  const isPaid = tx.isPaid;
                  const dateStr = new Date(tx.dueDate).toLocaleDateString('pt-BR', { timeZone: 'UTC', day: '2-digit', month: '2-digit' });
                  
                  return (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'white', borderRadius: '8px', border: '1px solid #E2E8F0', borderLeft: `4px solid ${isIncome ? '#10B981' : '#EF4444'}` }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ fontWeight: 'bold', color: '#64748B', width: '40px' }}>{dateStr}</div>
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#1E293B' }}>{tx.description}</div>
                          <div style={{ fontSize: '12px', display: 'flex', gap: '8px', marginTop: '4px' }}>
                            <Badge variant={isPaid ? 'success' : 'warning'}>{isPaid ? 'PAGO' : 'A PAGAR'}</Badge>
                            <span style={{ color: '#64748B', alignSelf: 'center' }}>{tx.source === 'MANUAL' ? 'Manual' : 'Regra'}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <strong style={{ color: isIncome ? '#10B981' : '#EF4444', fontSize: '16px' }}>{isIncome ? '+' : '-'}{priceBRL(tx.amount)}</strong>
                        <Button variant="ghost" size="sm" onClick={() => setEditingTx(tx)}>Editar</Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
};
