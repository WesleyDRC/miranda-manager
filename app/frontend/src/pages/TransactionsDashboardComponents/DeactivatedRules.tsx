import React, { useState } from 'react';
import priceBRL from '../../utils/formatPrice';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';

interface DeactivatedRulesProps {
  deactivatedIncomes: any[];
  deactivatedExpenses: any[];
  setDeleteModalTxId: (id: string | null) => void;
}

export const DeactivatedRules: React.FC<DeactivatedRulesProps> = ({
  deactivatedIncomes,
  deactivatedExpenses,
  setDeleteModalTxId
}) => {
  const [selectedRule, setSelectedRule] = useState<any | null>(null);

  if (deactivatedIncomes.length === 0 && deactivatedExpenses.length === 0) {
    return null;
  }

  const renderDetailsModal = () => {
    if (!selectedRule) return null;
    
    return (
      <Modal
        isOpen={!!selectedRule}
        onClose={() => setSelectedRule(null)}
        title="Detalhes da Regra Encerrada"
        maxWidth="500px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span style={{ color: '#64748B', fontSize: '12px', display: 'block' }}>Descrição</span>
            <strong style={{ fontSize: '18px', color: '#1E293B' }}>{selectedRule.description}</strong>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <div>
              <span style={{ color: '#64748B', fontSize: '12px', display: 'block' }}>Valor Original</span>
              <strong style={{ color: selectedRule.type === 'INCOME' ? '#10B981' : '#EF4444', fontSize: '18px' }}>
                {priceBRL(selectedRule.amount)}
              </strong>
            </div>
            <div>
              <span style={{ color: '#64748B', fontSize: '12px', display: 'block' }}>Classificação</span>
              <Badge variant={selectedRule.type === 'INCOME' ? 'success' : 'danger'}>
                {selectedRule.type === 'INCOME' ? 'RECEITA' : 'DESPESA'}
              </Badge>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '24px', background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
            <div>
              <span style={{ color: '#64748B', fontSize: '12px', display: 'block' }}>Início da Regra (Primeiro Venc.)</span>
              <strong style={{ color: '#334155' }}>
                {selectedRule.dueDate ? new Date(selectedRule.dueDate).toLocaleDateString('pt-BR') : 'Desconhecido'}
              </strong>
            </div>
            <div>
              <span style={{ color: '#64748B', fontSize: '12px', display: 'block' }}>Data de Encerramento (Fim)</span>
              <strong style={{ color: '#334155' }}>
                {selectedRule.endDate ? new Date(selectedRule.endDate).toLocaleDateString('pt-BR') : 'Manual/Direto'}
              </strong>
            </div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => {
                setDeleteModalTxId(selectedRule.id);
                setSelectedRule(null);
              }}
              style={{ background: '#EF4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Apagar Histórico
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div style={{ marginTop: '40px' }}>
      {renderDetailsModal()}
      <h3 style={{ color: '#64748B', borderBottom: '2px solid #E2E8F0', paddingBottom: '8px' }}>Histórico de Regras Encerradas</h3>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '16px' }}>
        
        {deactivatedIncomes.length > 0 && (
          <section style={{ flex: 1, minWidth: '300px', opacity: 0.7 }}>
            <h4 style={{ color: '#64748B' }}>Receitas Antigas</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {deactivatedIncomes.map((tx, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedRule(tx)}
                  style={{ padding: '12px', background: '#F1F5F9', borderRadius: '8px', borderLeft: '4px solid #94A3B8', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#475569', textDecoration: 'line-through' }}>{tx.description}</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>Clique para ver detalhes</div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#94A3B8' }}>{priceBRL(tx.amount)}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {deactivatedExpenses.length > 0 && (
          <section style={{ flex: 1, minWidth: '300px', opacity: 0.7 }}>
            <h4 style={{ color: '#64748B' }}>Despesas Antigas</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {deactivatedExpenses.map((tx, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedRule(tx)}
                  style={{ padding: '12px', background: '#F1F5F9', borderRadius: '8px', borderLeft: '4px solid #94A3B8', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#475569', textDecoration: 'line-through' }}>{tx.description}</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>Clique para ver detalhes</div>
                    </div>
                    <div style={{ fontWeight: 'bold', color: '#94A3B8' }}>{priceBRL(tx.amount)}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
