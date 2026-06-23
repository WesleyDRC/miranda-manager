import React from 'react';
import priceBRL from '../../utils/formatPrice';

interface ForecastAlertsProps {
  bankruptMonthIndex?: number;
  projectedDebt?: number;
  bankruptDate?: string;
  bailoutPlan?: string;
  autoRescues?: Array<{date: string, amount: number, titleName: string}>;
}

export const ForecastAlerts: React.FC<ForecastAlertsProps> = ({
  bankruptMonthIndex,
  projectedDebt,
  bankruptDate,
  bailoutPlan,
  autoRescues = []
}) => {
  if (!bankruptMonthIndex && autoRescues.length === 0) return null;

  return (
    <>
      {autoRescues.length > 0 && (
        <div style={{ background: '#FEF9C3', border: '1px solid #FDE047', borderRadius: '12px', padding: '20px', marginBottom: bankruptMonthIndex ? '16px' : '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '24px' }}>🛡️</div>
          <div>
            <h3 style={{ color: '#854D0E', margin: '0 0 8px 0' }}>Resgate Automático Projetado</h3>
            <p style={{ color: '#A16207', margin: 0, fontSize: '15px' }}>
              O sistema detectou que seu caixa ficará negativo no futuro e simulou resgates automáticos da sua reserva de emergência para te manter no azul:
            </p>
            <ul style={{ margin: '12px 0 0 0', paddingLeft: '20px', color: '#713F12', fontSize: '14px' }}>
              {autoRescues.map((rescue, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>
                  <strong>{rescue.date}</strong>: Resgate de <strong>{priceBRL(rescue.amount)}</strong> do <strong>{rescue.titleName}</strong>.
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {bankruptMonthIndex && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '12px', padding: '20px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '24px' }}>⚠️</div>
          <div>
            <h3 style={{ color: '#991B1B', margin: '0 0 8px 0' }}>Atenção Crítica: Quebra de Caixa Detectada</h3>
            <p style={{ color: '#7F1D1D', margin: 0, fontSize: '15px' }}>
              Mantendo as projeções atuais e após esgotar a liquidez disponível, seu caixa ficará negativo (<strong>{priceBRL(projectedDebt || 0)}</strong>) em <strong>{bankruptDate}</strong>.
            </p>
            {bailoutPlan && (
              <div style={{ marginTop: '12px', background: '#FFF', padding: '12px', borderRadius: '8px', border: '1px dashed #FCA5A5' }}>
                <strong style={{ color: '#DC2626', display: 'block', marginBottom: '4px' }}>💡 Plano de Resgate Sugerido pela IA:</strong>
                <span style={{ color: '#450A0A', fontSize: '14px' }}>{bailoutPlan}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
