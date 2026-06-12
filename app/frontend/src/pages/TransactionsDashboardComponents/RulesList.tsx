import React from 'react';
import axiosRepositoryInstance from '../../repository/AxiosRepository';
import { toast } from 'react-toastify';
import priceBRL from '../../utils/formatPrice';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import styles from '../ForecastDashboard.module.css';

interface RulesListProps {
  loading: boolean;
  incomes: any[];
  expenses: any[];
  editingRule: string | null;
  setEditingRule: (id: string | null) => void;
  setDeleteModalTxId: (id: string | null) => void;
  onRuleUpdated: () => void;
}

export const RulesList: React.FC<RulesListProps> = ({
  loading,
  incomes,
  expenses,
  editingRule,
  setEditingRule,
  setDeleteModalTxId,
  onRuleUpdated
}) => {

  const renderList = (transactions: any[], isIncome: boolean) => {
    if (loading) return <div>Carregando...</div>;
    if (transactions.length === 0) return <div style={{ color: '#64748B' }}>Sem {isIncome ? 'receitas' : 'despesas'}.</div>;

    const borderColor = isIncome ? '#10B981' : '#EF4444';
    const textColor = isIncome ? '#10B981' : '#EF4444';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {transactions.slice(0, 5).map((tx, idx) => (
          <div key={idx} style={{ padding: '12px', background: '#F8FAFC', borderRadius: '8px', borderLeft: `4px solid ${borderColor}` }}>
            {editingRule === tx.id ? (
              <form onSubmit={async (e: any) => {
                e.preventDefault();
                try {
                  const newAmount = e.target.ruleAmount.value;
                  const newEndDate = e.target.ruleEndDate.value;
                  const updatePayload: any = {
                    amount: Number(newAmount),
                    updateRule: true
                  };
                  if (newEndDate) {
                    updatePayload.endDate = new Date(newEndDate);
                  }
                  await axiosRepositoryInstance.updateTransaction(tx.id, updatePayload);
                  toast.success('Regra base atualizada! Projeções futuras foram recalculadas.');
                  setEditingRule(null);
                  onRuleUpdated();
                } catch (err) {
                  toast.error('Erro ao atualizar regra');
                }
              }} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Input name="ruleAmount" type="number" step="0.01" defaultValue={tx.amount} style={{ width: '100px' }} />
                <Input name="ruleEndDate" type="date" defaultValue={tx.ruleEndDate ? new Date(tx.ruleEndDate).toISOString().split('T')[0] : ''} style={{ width: '130px' }} />
                <Button type="submit" variant="primary" size="sm">Salvar</Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => setEditingRule(null)}>Cancelar</Button>
              </form>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>{tx.description}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Regra: Dia {new Date(tx.dueDate).getDate()}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontWeight: 'bold', color: textColor }}>{priceBRL(tx.amount)}</div>
                  <Button variant="ghost" size="sm" onClick={() => setEditingRule(tx.id)} style={{ color: textColor }}>Editar</Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteModalTxId(tx.id)} style={{ color: '#EF4444' }}>Encerrar</Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <section className={styles.chartSection} style={{ flex: 1, minWidth: '300px' }}>
        <h3 style={{ color: '#10B981' }}>Minhas Regras de Receita</h3>
        {renderList(incomes, true)}
      </section>

      <section className={styles.chartSection} style={{ flex: 1, minWidth: '300px' }}>
        <h3 style={{ color: '#EF4444' }}>Minhas Regras de Despesa</h3>
        {renderList(expenses, false)}
      </section>
    </div>
  );
};
