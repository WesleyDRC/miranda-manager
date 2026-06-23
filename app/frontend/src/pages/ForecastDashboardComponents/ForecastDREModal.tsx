import React from 'react';
import priceBRL from '../../utils/formatPrice';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';

interface ForecastDREModalProps {
  detailsModalMonth: any;
  setDetailsModalMonth: (month: any | null) => void;
}

export const ForecastDREModal: React.FC<ForecastDREModalProps> = ({
  detailsModalMonth,
  setDetailsModalMonth
}) => {
  if (!detailsModalMonth) return null;

  return (
    <Modal
      isOpen={!!detailsModalMonth}
      onClose={() => setDetailsModalMonth(null)}
      title={`DRE Detalhada: ${detailsModalMonth.date}`}
      maxWidth="800px"
    >
      <div style={{ color: '#64748B', fontSize: '14px', marginBottom: '24px' }}>Demonstrativo de Resultado de Exercício</div>
      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, padding: '20px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center', minWidth: '150px' }}>
          <span style={{ color: '#64748B', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Receitas do Mês</span>
          <strong style={{ fontSize: '24px', color: '#10B981' }}>{priceBRL(detailsModalMonth.incomes)}</strong>
        </div>
        <div style={{ flex: 1, padding: '20px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center', minWidth: '150px' }}>
          <span style={{ color: '#64748B', fontSize: '14px', display: 'block', marginBottom: '8px' }}>Despesas do Mês</span>
          <strong style={{ fontSize: '24px', color: '#EF4444' }}>{priceBRL(detailsModalMonth.expenses)}</strong>
        </div>
        <div style={{ flex: 1, padding: '20px', background: '#EDE9FE', borderRadius: '12px', border: '1px solid #C4B5FD', textAlign: 'center', minWidth: '150px' }}>
          <span style={{ color: '#5E17EB', fontSize: '14px', display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Saldo Projetado</span>
          <strong style={{ fontSize: '24px', color: detailsModalMonth.projectedBalance < 0 ? '#EF4444' : '#5E17EB' }}>{priceBRL(detailsModalMonth.projectedBalance)}</strong>
        </div>
      </div>

      <h3 style={{ marginBottom: '16px', color: '#1E293B' }}>Transações Agendadas</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F1F5F9', color: '#475569', fontSize: '13px', textAlign: 'left' }}>
              <th style={{ padding: '12px 16px', borderRadius: '8px 0 0 8px' }}>Descrição</th>
              <th style={{ padding: '12px 16px' }}>Categoria</th>
              <th style={{ padding: '12px 16px', textAlign: 'right', borderRadius: '0 8px 8px 0' }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {detailsModalMonth.detailedTransactions && detailsModalMonth.detailedTransactions.map((tx: any, idx: number) => (
              <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '16px', fontWeight: 'bold', color: '#334155' }}>
                  {tx.source} <span style={{fontSize: '11px', color: '#94A3B8', marginLeft: '8px'}}>Dia {tx.day}</span>
                </td>
                <td style={{ padding: '16px' }}>
                  <Badge variant={tx.type === 'INCOME' ? 'success' : tx.type === 'EXPENSE' ? 'danger' : 'info'}>
                    {tx.type === 'INCOME' ? 'RECEITA' : tx.type === 'EXPENSE' ? 'DESPESA' : 'RENDIMENTO (EQUITY)'}
                  </Badge>
                </td>
                <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold', color: tx.type === 'INCOME' ? '#10B981' : tx.type === 'EXPENSE' ? '#EF4444' : '#5E17EB', fontSize: '16px' }}>
                  {tx.type === 'INCOME' ? '+' : tx.type === 'EXPENSE' ? '-' : '+'} {priceBRL(tx.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};
