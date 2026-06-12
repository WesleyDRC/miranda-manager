import React from 'react';
import priceBRL from '../../utils/formatPrice';
import { KpiCard } from '../../components/ui/KpiCard';
import { FaMoneyBillWave, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';

interface ForecastKPIsProps {
  currentBalance: number;
  currentEquity: number;
  bankruptMonthIndex?: number;
  bankruptDate?: string;
}

export const ForecastKPIs: React.FC<ForecastKPIsProps> = ({
  currentBalance,
  currentEquity,
  bankruptMonthIndex,
  bankruptDate
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
      <KpiCard 
        label="Liquidez Atual (Caixa)" 
        value={priceBRL(currentBalance)} 
        icon={<FaMoneyBillWave />} 
        variant="info" 
      />
      <KpiCard 
        label="Patrimônio Líquido Atual" 
        value={priceBRL(currentEquity)} 
        icon={<FaChartLine />} 
        variant="success" 
      />
      <KpiCard 
        label="Alerta de Fluxo de Caixa" 
        value={bankruptMonthIndex ? `Risco em ${bankruptDate}` : "Fluxo Saudável"} 
        icon={<FaExclamationTriangle />} 
        variant={bankruptMonthIndex ? "danger" : "warning"} 
      />
    </div>
  );
};
