import React from 'react';
import priceBRL from '../../utils/formatPrice';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface ForecastTimelineProps {
  availableYears: number[];
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  timelineToShow: any[];
  expandedDate: string | null;
  setExpandedDate: (date: string | null) => void;
}

export const ForecastTimeline: React.FC<ForecastTimelineProps> = ({
  availableYears,
  selectedYear,
  setSelectedYear,
  timelineToShow,
  expandedDate,
  setExpandedDate
}) => {
  return (
    <Card style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ margin: 0 }}>Demonstração do Resultado Mês a Mês</h3>
          <p style={{ color: '#64748B', fontSize: '14px', marginTop: '4px' }}>Expanda um mês para ver a DRE detalhada de todas as entradas e saídas.</p>
        </div>
        
        <select 
          value={selectedYear} 
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', fontWeight: 'bold', outline: 'none', cursor: 'pointer', background: '#F8FAFC' }}
        >
          {availableYears.map(y => (
            <option key={y} value={y}>Filtrar Ano: {y}</option>
          ))}
        </select>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {timelineToShow.map((month, index) => {
          const isExpanded = expandedDate === month.date;
          const isNegative = month.projectedBalance < 0;

          return (
            <div key={index} style={{ border: `1px solid ${isExpanded ? '#5E17EB' : '#E2E8F0'}`, borderRadius: '12px', overflow: 'hidden', background: isExpanded ? '#F8FAFC' : 'white' }}>
              <div 
                onClick={() => setExpandedDate(isExpanded ? null : month.date)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', cursor: 'pointer', background: isExpanded ? '#EDE9FE' : 'transparent', flexWrap: 'wrap', gap: '16px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '200px' }}>
                  {isExpanded ? <FaChevronUp color="#5E17EB" /> : <FaChevronDown color="#64748B" />}
                  <strong style={{ fontSize: '16px', color: '#1E293B' }}>{month.date}</strong>
                </div>
                
                <div style={{ display: 'flex', gap: '48px', flex: 1, justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Entradas Totais</span>
                    <strong style={{ color: '#10B981' }}>{priceBRL(month.incomes)}</strong>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Saídas Totais</span>
                    <strong style={{ color: '#EF4444' }}>{priceBRL(month.expenses)}</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right', width: '200px' }}>
                  <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Saldo Final Estimado</span>
                  <strong style={{ fontSize: '18px', color: isNegative ? '#EF4444' : '#0F172A' }}>{priceBRL(month.projectedBalance)}</strong>
                </div>
              </div>

              {isExpanded && (
                <div style={{ padding: '24px', borderTop: '1px solid #E2E8F0' }}>
                  <h4 style={{ color: '#1E293B', marginBottom: '16px' }}>Detalhamento Contábil (DRE Projetada)</h4>
                  
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B', fontSize: '12px', textAlign: 'left' }}>
                          <th style={{ paddingBottom: '8px' }}>Categoria/Origem</th>
                          <th style={{ paddingBottom: '8px' }}>Classificação</th>
                          <th style={{ paddingBottom: '8px', textAlign: 'right' }}>Impacto no Caixa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {month.detailedTransactions && month.detailedTransactions.map((tx: any, idx: number) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '12px 0', fontWeight: 'bold', color: '#334155' }}>
                              {tx.source} <span style={{fontSize: '11px', color: '#94A3B8', marginLeft: '8px'}}>Dia {tx.day}</span>
                            </td>
                            <td style={{ padding: '12px 0' }}>
                              <Badge variant={tx.type === 'INCOME' ? 'success' : 'danger'}>
                                {tx.type === 'INCOME' ? 'RECEITA' : 'DESPESA'}
                              </Badge>
                            </td>
                            <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 'bold', color: tx.type === 'INCOME' ? '#10B981' : '#EF4444' }}>
                              {tx.type === 'INCOME' ? '+' : '-'} {priceBRL(tx.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '16px', borderTop: '2px dashed #CBD5E1', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ color: '#64748B', fontSize: '14px' }}>Resultado Líquido do Mês: <strong style={{ color: (month.incomes - month.expenses) >= 0 ? '#10B981' : '#EF4444' }}>{(month.incomes - month.expenses) >= 0 ? '+ ' : '- '}{priceBRL(Math.abs(month.incomes - month.expenses))}</strong></div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#64748B', fontSize: '14px' }}>Crescimento de Patrimônio (Equity) Adicionado: <strong style={{ color: '#10B981' }}>+ {priceBRL(month.composition?.patrimonyInstallments || 0)}</strong></div>
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};
