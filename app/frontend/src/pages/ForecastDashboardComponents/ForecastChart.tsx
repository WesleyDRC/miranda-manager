import React from 'react';
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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'white', padding: '16px', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#1E293B' }}>{label}</div>
        {payload.map((entry: any, index: number) => (
          <div key={index} style={{ color: entry.color, fontWeight: 'bold', fontSize: '14px', marginTop: '4px' }}>
            {entry.name}: {priceBRL(entry.value)}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

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
  return (
    <Card style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h3 style={{ margin: 0 }}>Evolução: Liquidez vs Patrimônio Líquido</h3>
          <div style={{ fontSize: '13px', color: '#64748B', marginTop: '12px', background: '#F8FAFC', padding: '12px', borderRadius: '8px', display: 'inline-block', border: '1px solid #E2E8F0' }}>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: '#5E17EB', fontWeight: 'bold' }}>● Caixa Projetado:</span> Dinheiro real na sua conta bancária (Liquidez). Sobe com Receitas, desce com Despesas.
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: '#EF4444', fontWeight: 'bold' }}>● Saídas (Despesas):</span> Total de gastos do mês (Custos fixos + Parcelas de financiamento).
            </div>
            <div>
              <span style={{ color: '#10B981', fontWeight: 'bold' }}>● Patrimônio Líquido (Equity):</span> Saldo do Caixa + Valor de Mercado dos Bens - Dívidas Restantes.
              <div style={{ marginTop: '4px', fontSize: '12px', color: '#94A3B8' }}>
                <em>Cresce a cada parcela paga, pois sua dívida diminui e sua "fatia real" do bem aumenta.</em>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', background: '#F1F5F9', padding: '4px', borderRadius: '8px' }}>
            <button 
              onClick={() => setTimeFilter("FUTURE_ONLY")} 
              style={{ padding: '8px 16px', background: timeFilter === 'FUTURE_ONLY' ? 'white' : 'transparent', color: timeFilter === 'FUTURE_ONLY' ? '#0F172A' : '#64748B', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', boxShadow: timeFilter === 'FUTURE_ONLY' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
              Projeção Futura
            </button>
            <button 
              onClick={() => setTimeFilter("ALL_HISTORY")} 
              style={{ padding: '8px 16px', background: timeFilter === 'ALL_HISTORY' ? 'white' : 'transparent', color: timeFilter === 'ALL_HISTORY' ? '#0F172A' : '#64748B', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', boxShadow: timeFilter === 'ALL_HISTORY' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
              Histórico Completo
            </button>
          </div>
          <button style={{ padding: '8px 16px', border: '1px solid #CBD5E1', background: 'white', borderRadius: '8px', fontWeight: 'bold', color: '#64748B', cursor: 'pointer' }}>
            Exportar Relatório (PDF)
          </button>
        </div>
      </div>
      
      <div style={{ height: '400px', marginTop: '24px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={filteredTimeline} 
            margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
            style={{ cursor: 'pointer' }}
            onClick={(e: any) => {
              if (e && e.activeLabel) {
                const dateStr = e.activeLabel;
                const monthData = timeline.find(m => m.date === dateStr);
                if (monthData) {
                  setDetailsModalMonth(monthData);
                }
              }
            }}
          >
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={bankruptMonthIndex ? "#FB923C" : "#8B5CF6"} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={bankruptMonthIndex ? "#FFF7ED" : "#EDE9FE"} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(val) => `R$ ${val/1000}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36}/>
            <ReferenceLine y={0} stroke="#EF4444" strokeDasharray="3 3" />
            <Area type="monotone" name="Caixa Projetado" dataKey="projectedBalance" stroke={bankruptMonthIndex ? "#F97316" : "#5E17EB"} strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
            <Area type="monotone" name="Patrimônio Líquido (Equity)" dataKey="projectedEquity" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorEquity)" />
            <Area type="monotone" name="Saídas (Despesas)" dataKey="expenses" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
