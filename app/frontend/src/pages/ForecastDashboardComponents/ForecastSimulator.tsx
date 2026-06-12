import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

interface ForecastSimulatorProps {
  activeScenario: string | null;
  setActiveScenario: (scenario: string | null) => void;
}

export const ForecastSimulator: React.FC<ForecastSimulatorProps> = ({
  activeScenario,
  setActiveScenario
}) => {
  return (
    <Card style={{ marginTop: '24px', background: activeScenario ? '#FEF2F2' : '#F8FAFC', border: activeScenario ? '2px solid #EF4444' : '1px dashed #CBD5E1', transition: 'all 0.3s' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ color: activeScenario ? '#991B1B' : '#334155', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px 0' }}>
            🧪 Simulador de Cenários (Stress Test) 
            {activeScenario && <span style={{ fontSize: '12px', background: '#EF4444', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>ATIVO</span>}
          </h3>
          <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>Ative os cenários abaixo para visualizar como seu fluxo de caixa e patrimônio reagiriam a eventos inesperados.</p>
        </div>
        {activeScenario && (
          <Button onClick={() => setActiveScenario(null)} style={{ background: '#334155', color: 'white', border: 'none' }}>
            Voltar para Realidade (Limpar Cenário)
          </Button>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveScenario('LOSS_JOB')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '12px 16px', background: activeScenario === 'LOSS_JOB' ? '#FEE2E2' : 'white', border: activeScenario === 'LOSS_JOB' ? '2px solid #EF4444' : '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', flex: 1, minWidth: '200px' }}>
          <span style={{ fontWeight: 'bold', color: '#EF4444' }}>Perda de Emprego</span>
          <span style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Zera o Salário (Recorrentes) a partir de agora.</span>
        </button>

        <button onClick={() => setActiveScenario('SELL_CAR')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '12px 16px', background: activeScenario === 'SELL_CAR' ? '#D1FAE5' : 'white', border: activeScenario === 'SELL_CAR' ? '2px solid #10B981' : '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', flex: 1, minWidth: '200px' }}>
          <span style={{ fontWeight: 'bold', color: '#10B981' }}>Venda de Veículo</span>
          <span style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Injeta R$ 50k de liquidez imediata no caixa.</span>
        </button>

        <button onClick={() => setActiveScenario('NEW_BABY')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '12px 16px', background: activeScenario === 'NEW_BABY' ? '#FEF3C7' : 'white', border: activeScenario === 'NEW_BABY' ? '2px solid #F59E0B' : '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', flex: 1, minWidth: '200px' }}>
          <span style={{ fontWeight: 'bold', color: '#F59E0B' }}>Filho Inesperado</span>
          <span style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Aumenta o Custo Fixo em R$ 3.000 mensais.</span>
        </button>
      </div>
    </Card>
  );
};
