import styles from "./Dashboard.module.css";

import { KpiCard } from "../components/dashboard/components/KpiCard";
import { FunctionalityCard } from "../components/dashboard/components/FunctionalityCard";
import { DashboardChart } from "../components/dashboard/components/DashboardChart";
import { ComingSoonCard } from "../components/dashboard/components/ComingSoonCard";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import expenseIcon from "../assets/expense.svg";
import categoryIcon from "../assets/category.svg";
import treasuryIcon from "../assets/treasury.svg";

import { useFinance } from "../hooks/useFinance";
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

import axiosRepositoryInstance from "../repository/AxiosRepository";

import priceBRL from "../utils/formatPrice";
import { getMonthName } from "../utils/formatDate";

const CHART_COLORS = ["#5E17EB", "#8B5CF6", "#C084FC", "#38BDF8", "#10B981"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.chartTooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className={styles.tooltipValue}>
            {entry.name}: {priceBRL(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function Dashboard() {
  const { totalRentalEarnings, totalAssets, fetchFinances, finances } =
    useFinance();

  const [monthlyData, setMonthlyData] = useState([]);
  const [loadingCharts, setLoadingCharts] = useState(false);

  useEffect(() => {
    fetchFinances();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const fetchRentDetails = async () => {
      if (finances.length === 0) return;
      setLoadingCharts(true);

      try {
        const rentFinances = finances.filter(
          (f) => f.category?.name?.toLowerCase() === "aluguel" && f.rent?.id
        );

        const allMonthlyData = [];

        for (const finance of rentFinances) {
          try {
            const response = await axiosRepositoryInstance.getRentById({
              id: finance.rent.id,
            });

            const rent = response.data.rent;
            if (rent?.months) {
              rent.months.forEach((month) => {
                allMonthlyData.push({
                  name: getMonthName(month.dateMonth),
                  receita: month.amountPaid || 0,
                  tenant: rent.tenant,
                });
              });
            }
          } catch (err) {
            /* skip rent if fetch fails */
            console.log("error")
          }
        }

        setMonthlyData(allMonthlyData);
      } catch (err) {
        /* silent */
        setLoadingCharts(false);
      }
      console.log("LAODING FALSE")
      setLoadingCharts(false);
    };

    fetchRentDetails();
    // eslint-disable-next-line
  }, [finances]);

  const distributionData = useMemo(() => {
    const data = [];
    if (totalRentalEarnings > 0) {
      data.push({ name: "Aluguel", value: totalRentalEarnings });
    }
    // Placeholder for future categories
    if (data.length === 0) {
      data.push({ name: "Aluguel", value: 0 });
    }
    return data;
  }, [totalRentalEarnings]);

  const functionalities = [
    {
      id: 1,
      icon: expenseIcon,
      name: "Criar finança",
      path: "/finance/create",
    },
    {
      id: 2,
      icon: categoryIcon,
      name: "Criar categoria",
      path: "/category/create",
    },
    {
      id: 3,
      icon: treasuryIcon,
      name: "Tesouro Direto",
      path: "/investments/treasury",
    },
  ];

  return (
    <main className={styles.main}>
      {/* KPI Cards */}
      <section className={styles.kpiSection}>
        <h2 className={styles.sectionTitle}>Dashboard</h2>
        <div className={styles.kpiGrid}>
          <KpiCard
            icon="💰"
            label="Meu Patrimônio"
            value={priceBRL(totalAssets, true)}
            subtitle="Total acumulado"
          />
          <Link to="/investments/treasury" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <KpiCard
              icon="📈"
              label="Investimentos"
              value="Ativos"
              subtitle="Tesouro Direto"
              variant="info"
            />
          </Link>
          <KpiCard
            icon="📋"
            label="Despesas"
            value={priceBRL(0, true)}
            subtitle="Sem registros"
            variant="warning"
          />
          <Link to="/rentals" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <KpiCard
              icon="🏠"
              label="Aluguel"
              value={priceBRL(totalRentalEarnings, true)}
              subtitle="Ganho líquido"
              variant="success"
            />
          </Link>
        </div>
      </section>

      {/* Charts Section */}
      <section className={styles.chartsSection}>
        <h2 className={styles.sectionTitle}>Visão Geral</h2>
        <div className={styles.chartsGrid}>
          <DashboardChart
            title="Receita mensal de aluguel"
            subtitle="Valores recebidos por mês"
            minHeight={300}
          >
            {loadingCharts ? (
              <div className={styles.chartLoading}>
                <div className={styles.spinner} />
                <span>Carregando dados...</span>
              </div>
            ) : monthlyData.length === 0 ? (
              <div className={styles.chartEmpty}>
                <span>📊</span>
                <p>Nenhum dado de aluguel encontrado</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#64748B" }}
                    axisLine={{ stroke: "#E2E8F0" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#64748B" }}
                    axisLine={{ stroke: "#E2E8F0" }}
                    tickFormatter={(value) => `R$ ${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="receita"
                    name="Receita"
                    fill="#5E17EB"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={48}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </DashboardChart>

          <DashboardChart
            title="Distribuição financeira"
            subtitle="Proporção entre categorias"
            minHeight={300}
          >
            {distributionData.every((d) => d.value === 0) ? (
              <div className={styles.chartEmpty}>
                <span>🍩</span>
                <p>Dados insuficientes para o gráfico</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => priceBRL(value)}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      fontSize: "13px",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: "13px", paddingTop: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </DashboardChart>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className={styles.comingSoonSection}>
        <h2 className={styles.sectionTitle}>Próximas funcionalidades</h2>
        <div className={styles.comingSoonGrid}>
          <ComingSoonCard
            icon="📊"
            title="Relatórios"
            description="Relatórios detalhados sobre suas finanças"
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section className={styles.actionsSection}>
        <h2 className={styles.sectionTitle}>Ações rápidas</h2>
        <div className={styles.actionsGrid}>
          {functionalities.map((functionality) => (
            <FunctionalityCard
              path={functionality.path}
              key={functionality.id}
              icon={functionality.icon}
              alt={functionality.name}
              name={functionality.name}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
