import React, { useCallback, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts';
import priceBRL from '../../utils/formatPrice';
import { Card } from '../../components/ui/Card';
import styles from './ForecastChart.module.css';

const CustomTooltip = React.memo(({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltipContainer}>
        <div className={styles.tooltipTitle}>{label}</div>
        {payload.map((entry: any, index: number) => (
          <div key={index} className={styles.tooltipItem} style={{ color: entry.color }}>
            {entry.name}: {priceBRL(entry.value)}
          </div>
        ))}
      </div>
    );
  }
  return null;
});

interface ForecastChartProps {
  filteredTimeline: any[];
  bankruptMonthIndex?: number;
  timeline: any[];
  setDetailsModalMonth: (monthData: any) => void;
  timeFilter: string;
  setTimeFilter: (filter: string) => void;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({
  filteredTimeline,
  bankruptMonthIndex,
  timeline,
  setDetailsModalMonth,
  timeFilter,
  setTimeFilter
}) => {
  
  const handleChartClick = useCallback((e: any) => {
    if (e && e.activeLabel) {
      const dateStr = e.activeLabel;
      const monthData = timeline.find(m => m.date === dateStr);
      if (monthData) {
        setDetailsModalMonth(monthData);
      }
    }
  }, [timeline, setDetailsModalMonth]);

  const balanceColor = useMemo(() => bankruptMonthIndex ? "#F97316" : "#5E17EB", [bankruptMonthIndex]);
  const balanceGradientStart = useMemo(() => bankruptMonthIndex ? "#FB923C" : "#8B5CF6", [bankruptMonthIndex]);
  const balanceGradientEnd = useMemo(() => bankruptMonthIndex ? "#FFF7ED" : "#EDE9FE", [bankruptMonthIndex]);

  return (
    <Card style={{ marginTop: '24px' }}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Evolução: Liquidez vs Patrimônio Líquido</h3>
          <div className={styles.legendBox}>
            <div className={styles.legendItem}>
              <span className={styles.legendDotBalance}>● Caixa Projetado:</span> Dinheiro real na sua conta bancária (Liquidez). Sobe com Receitas, desce com Despesas.
            </div>
            <div className={styles.legendItem}>
              <span className={styles.legendDotExpense}>● Saídas (Despesas):</span> Total de gastos do mês (Custos fixos + Parcelas de financiamento).
            </div>
            <div>
              <span className={styles.legendDotEquity}>● Patrimônio Líquido (Equity):</span> Saldo do Caixa + Valor de Mercado dos Bens - Dívidas Restantes.
              <div className={styles.legendSubText}>
                <em>Cresce a cada parcela paga, pois sua dívida diminui e sua "fatia real" do bem aumenta.</em>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.actionsContainer}>
          <div className={styles.filterGroup}>
            <button 
              onClick={() => setTimeFilter("FUTURE_ONLY")} 
              className={timeFilter === 'FUTURE_ONLY' ? styles.filterButtonActive : styles.filterButton}
            >
              Projeção Futura
            </button>
            <button 
              onClick={() => setTimeFilter("ALL_HISTORY")} 
              className={timeFilter === 'ALL_HISTORY' ? styles.filterButtonActive : styles.filterButton}
            >
              Histórico Completo
            </button>
          </div>
          <button className={styles.exportButton}>
            Exportar Relatório (PDF)
          </button>
        </div>
      </div>
      
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={filteredTimeline} 
            margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
            style={{ cursor: 'pointer' }}
            onClick={handleChartClick}
          >
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={balanceGradientStart} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={balanceGradientEnd} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorInvestments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(val) => `R$ ${val/1000}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36}/>
            <ReferenceLine y={0} stroke="#EF4444" strokeDasharray="3 3" />
            <Area type="monotone" name="Caixa Projetado" dataKey="projectedBalance" stroke={balanceColor} strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
            <Area type="monotone" name="Patrimônio Líquido (Equity)" dataKey="projectedEquity" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorEquity)" />
            <Area type="monotone" name="Investimentos (Tesouro)" dataKey="composition.treasuryBalance" stroke="#0EA5E9" strokeWidth={2} fillOpacity={1} fill="url(#colorInvestments)" />
            <Area type="monotone" name="Saídas (Despesas)" dataKey="expenses" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
