import React from 'react';
import { KpiCard } from '../../components/ui/KpiCard';
import {
  FaBuilding,
  FaCalendarAlt,
  FaChartBar,
  FaClock,
  FaExclamationTriangle,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaPercentage,
  FaDollarSign,
  FaChartLine
} from 'react-icons/fa';
import priceBRL from '../../utils/formatPrice';
import styles from '../RentalsDashboard.module.css';

interface RentalsKPIProps {
  summary: {
    totalReceivedThisMonth: number;
    totalPendingThisMonth: number;
    defaultingTenantsCount: number;
    expectedIncomeNextMonth: number;
    totalPropertiesRented: number;
    delinquencyRate: number;
    expectedAnnualRevenue: number;
    totalOpenValue: number;
    totalGrossIncome: number;
    totalNetIncome: number;
  };
}

export const RentalsKPI: React.FC<RentalsKPIProps> = ({ summary }) => {
  return (
    <section className={styles.kpiGrid} aria-label="Resumo Financeiro Geral">
      <KpiCard
        icon={<FaMoneyBillWave />}
        label="Recebido no Mês"
        value={priceBRL(summary.totalReceivedThisMonth)}
        subtitle="Entradas deste mês"
        variant="success"
      />
      <KpiCard
        icon={<FaClock />}
        label="Total Pendente (Mês)"
        value={priceBRL(summary.totalPendingThisMonth)}
        subtitle="A receber neste mês"
        variant="warning"
      />
      <KpiCard
        icon={<FaExclamationTriangle />}
        label="Inquilinos Inadimplentes"
        value={summary.defaultingTenantsCount}
        subtitle="Contratos em atraso"
        variant="danger"
      />
      <KpiCard
        icon={<FaCalendarAlt />}
        label="Previsto Próximo Mês"
        value={priceBRL(summary.expectedIncomeNextMonth)}
        subtitle="Próximo faturamento"
        variant="info"
      />
      <KpiCard
        icon={<FaBuilding />}
        label="Imóveis Alugados"
        value={summary.totalPropertiesRented}
        subtitle="Contratos ativos"
        variant="default"
      />
      <KpiCard
        icon={<FaPercentage />}
        label="Taxa de Inadimplência"
        value={`${summary.delinquencyRate}%`}
        subtitle="Proporção de atrasos"
        variant="danger"
      />
      <KpiCard
        icon={<FaChartBar />}
        label="Receita Anual Prevista"
        value={priceBRL(summary.expectedAnnualRevenue)}
        subtitle="Estimativa para 12 meses"
        variant="info"
      />
      <KpiCard
        icon={<FaFileInvoiceDollar />}
        label="Valor Total em Aberto"
        value={priceBRL(summary.totalOpenValue)}
        subtitle="Dívida acumulada total"
        variant="warning"
      />
      <KpiCard
        icon={<FaDollarSign />}
        label="Ganho Bruto Histórico"
        value={priceBRL(summary.totalGrossIncome)}
        subtitle="Faturamento bruto total"
        variant="success"
      />
      <KpiCard
        icon={<FaChartLine />}
        label="Ganho Líquido Histórico"
        value={priceBRL(summary.totalNetIncome)}
        subtitle="Faturamento líquido total"
        variant="success"
      />
    </section>
  );
};
