import React from 'react';
import priceBRL from '../../utils/formatPrice';

interface ForecastAlertsProps {
  bankruptMonthIndex?: number;
  projectedDebt?: number;
  bankruptDate?: string;
  bailoutPlan?: string;
}

export const ForecastAlerts: React.FC<ForecastAlertsProps> = ({
  bankruptMonthIndex,
  projectedDebt,
  bankruptDate,
  bailoutPlan
}) => {
  if (!bankruptMonthIndex) return null;

  return (
    <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '12px', padding: '20px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      <div style={{ fontSize: '24px' }}>⚠️</div>
      <div>
        <h3 style={{ color: '#991B1B', margin: '0 0 8px 0' }}>Atenção Crítica: Quebra de Caixa Detectada</h3>
        <p style={{ color: '#7F1D1D', margin: 0, fontSize: '15px' }}>
          Mantendo as projeções atuais, seu caixa ficará negativo (<strong>{priceBRL(projectedDebt || 0)}</strong>) em <strong>{bankruptDate}</strong>.
        </p>
        {bailoutPlan && (
          <div style={{ marginTop: '12px', background: '#FFF', padding: '12px', borderRadius: '8px', border: '1px dashed #FCA5A5' }}>
            <strong style={{ color: '#DC2626', display: 'block', marginBottom: '4px' }}>💡 Plano de Resgate Sugerido pela IA:</strong>
            <span style={{ color: '#450A0A', fontSize: '14px' }}>{bailoutPlan}</span>
          </div>
        )}
      </div>
    </div>
  );
};
