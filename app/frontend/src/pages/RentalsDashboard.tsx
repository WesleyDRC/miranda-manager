// @ts-nocheck
import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useFinance } from "../hooks/useFinance";
import axiosRepositoryInstance from "../repository/AxiosRepository";
import priceBRL from "../utils/formatPrice";
import { getMonthName } from "../utils/formatDate";
import ModalEditMonthRent from "../components/financeDetails/ModalEditMonthRent";
import { toast } from "react-toastify";
import { RentalsKPI } from "./RentalsDashboardComponents/RentalsKPI";
import { RentalsTable } from "./RentalsDashboardComponents/RentalsTable";
import { RentalsDrawer } from "./RentalsDashboardComponents/RentalsDrawer";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";

import {
  FaArrowLeft,
  FaBuilding,
  FaCalendarAlt,
  FaChartBar,
  FaClock,
  FaExclamationTriangle,
  FaFilter,
  FaFileInvoiceDollar,
  FaInfoCircle,
  FaMoneyBillWave,
  FaPercentage,
  FaSearch,
  FaSort,
  FaSave,
  FaTimes,
  FaMapMarkerAlt,
  FaHistory,
  FaDollarSign,
  FaRegClipboard,
  FaChartLine
} from "react-icons/fa";

import styles from "./RentalsDashboard.module.css";


const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.chartTooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className={styles.tooltipValue} style={{ color: entry.color }}>
            {entry.name}: {priceBRL(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function RentalsDashboard() {
  const { fetchRentData } = useFinance();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Selected Tenant Drawer State
  const [selectedRentId, setSelectedRentId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [observationsText, setObservationsText] = useState("");
  const [savingObservations, setSavingObservations] = useState(false);

  // Edit Month Modal State
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isEditMonthModalOpen, setIsEditMonthModalOpen] = useState(false);
  const [activePieSegment, setActivePieSegment] = useState(null);

  const fetchDashboardData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await axiosRepositoryInstance.getRentDashboard();
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar os dados do painel de alugueis.");
      toast.error("Erro ao carregar dados do servidor");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const selectedRent = useMemo(() => {
    if (!dashboardData || !selectedRentId) return null;
    return dashboardData.rentals.find((r) => r.id === selectedRentId);
  }, [dashboardData, selectedRentId]);

  const outstandingMonths = useMemo(() => {
    if (!dashboardData) return [];
    const items = [];
    dashboardData.rentals.forEach((rent) => {
      rent.months.forEach((month) => {
        if (!month.paid) {
          items.push({
            rentId: rent.id,
            tenant: rent.tenant,
            monthName: getMonthName(month.dateMonth),
            owed: month.difference,
            dateMonth: month.dateMonth,
          });
        }
      });
    });
    return items;
  }, [dashboardData]);

  const totalPaidAllTime = useMemo(() => {
    if (!dashboardData) return 0;
    return dashboardData.rentals.reduce((sum, r) => sum + r.totalPaid, 0);
  }, [dashboardData]);

  const handlePieClick = (data, index) => {
    if (!dashboardData) return;
    const segmentName = dashboardData.charts.delinquency[index].name;
    setActivePieSegment((prev) => (prev === segmentName ? null : segmentName));
  };

  // Open drawer and update notes state
  const handleSelectRent = (rent) => {
    setSelectedRentId(rent.id);
    setObservationsText(rent.observations || "");
    setIsDrawerOpen(true);
  };

  const handleSaveObservations = async () => {
    if (!selectedRentId) return;
    setSavingObservations(true);
    try {
      await axiosRepositoryInstance.updateRent(selectedRentId, {
        observations: observationsText,
      });
      toast.success("Observações salvas com sucesso!");
      // Update local state without full reload
      setDashboardData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          rentals: prev.rentals.map((r) =>
            r.id === selectedRentId ? { ...r, observations: observationsText } : r
          ),
        };
      });
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar observações.");
    } finally {
      setSavingObservations(false);
    }
  };

  const handleOpenEditMonthModal = async (monthObj) => {
    if (!selectedRentId) return;
    try {
      // Pre-fetch the specific rent data so that it's in the shared context
      await fetchRentData(selectedRentId);

      // Extract month name in Portuguese from dateMonth (which is DD/MM/YYYY)
      const nameMonth = getMonthName(monthObj.dateMonth);

      setSelectedMonth({
        rentId: selectedRentId,
        rentMonthId: monthObj.id,
        monthName: nameMonth,
        paid: monthObj.paid,
        amount: monthObj.amountPaid,
      });
      setIsEditMonthModalOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao abrir modal de edição");
    }
  };

  const handleCloseEditMonthModal = () => {
    setIsEditMonthModalOpen(false);
    setSelectedMonth(null);
    // Refresh dashboard data silently to reflect updates
    fetchDashboardData(true);
  };


  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Carregando análises financeiras de alugueis...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <FaExclamationTriangle className={styles.errorIcon} />
        <h2>Ops! Ocorreu um erro</h2>
        <p>{error}</p>
        <button onClick={() => fetchDashboardData()} className={styles.btnRetry}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  const { summary, charts } = dashboardData;

  return (
    <main className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <Link to="/dashboard" className={styles.btnBack}>
            <FaArrowLeft /> Voltar ao Dashboard
          </Link>
          <h1>Painel de Alugueis</h1>
          <p>Gestão e análises integradas de contratos de inquilinos</p>
        </div>
      </header>

      {/* KPI Section */}
      <RentalsKPI summary={summary} />

      {/* Charts Section */}
      <section className={styles.chartsGrid}>
        {/* Monthly Revenue Chart */}
        <div className={styles.chartWrapper}>
          <h3>Evolução Mensal (Últimos 12 meses)</h3>
          <p>Comparativo entre valores previstos e valores recebidos</p>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={charts.monthlyRevenue}>
                <defs>
                  <linearGradient id="colorPrevisto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRecebido" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748B" }} />
                <YAxis tickFormatter={(val) => `R$${val}`} tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="previsto" name="Faturamento Esperado" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorPrevisto)" />
                <Area type="monotone" dataKey="recebido" name="Receita Realizada" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorRecebido)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delinquency Proportion */}
        <div className={styles.chartWrapper}>
          <h3>Adimplência Geral</h3>
          <p>Proporção histórica total paga vs em débito (clique nos segmentos para ver detalhes)</p>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={charts.delinquency}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  onClick={handlePieClick}
                  style={{ cursor: "pointer" }}
                >
                  <Cell fill="#10B981" />
                  <Cell fill="#EF4444" />
                </Pie>
                <Tooltip formatter={(val) => priceBRL(val)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Details list below the chart */}
          {activePieSegment === "Em Aberto" && (
            <div className={styles.pieDetailsContainer}>
              <h4>Contratos com Parcelas em Aberto ({outstandingMonths.length})</h4>
              {outstandingMonths.length > 0 ? (
                <div className={styles.pieDetailsList}>
                  {outstandingMonths.map((item, idx) => (
                    <div
                      key={idx}
                      className={styles.pieDetailsItem}
                      onClick={() => {
                        const rentObj = dashboardData.rentals.find((r) => r.id === item.rentId);
                        if (rentObj) handleSelectRent(rentObj);
                      }}
                    >
                      <div className={styles.pieDetailsItemLeft}>
                        <strong>{item.tenant}</strong>
                        <span>{item.monthName}</span>
                      </div>
                      <span className={styles.pieDetailsOwedBadge}>
                        -{priceBRL(item.owed)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noPieDetails}>Excelente! Nenhum valor em aberto.</p>
              )}
            </div>
          )}

          {activePieSegment === "Pago" && (
            <div className={styles.pieDetailsContainer}>
              <h4>Histórico de Recebimentos</h4>
              <p className={styles.pieDetailsSuccessMsg}>
                🎉 Parabéns! Você já faturou um valor total acumulado de <strong>{priceBRL(totalPaidAllTime)}</strong> líquidos nos seus contratos de aluguel.
              </p>
            </div>
          )}
        </div>

        {/* Prediction area */}
        <div className={styles.chartWrapper}>
          <h3>Previsão de Receita (Próximos 6 meses)</h3>
          <p>Projeção de faturamento com base nos contratos ativos</p>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={charts.forecast}>
                <defs>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748B" }} />
                <YAxis tickFormatter={(val) => `R$${val}`} tick={{ fontSize: 10, fill: "#64748B" }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="previsto" name="Faturamento Projetado" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorForecast)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Property */}
        <div className={styles.chartWrapper}>
          <h3>Faturamento por Imóvel</h3>
          <p>Valores recebidos por propriedade alugada</p>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={charts.propertyRevenue.slice(0, 5)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis type="number" tickFormatter={(val) => `R$${val}`} tick={{ fontSize: 10, fill: "#64748B" }} />
                <YAxis dataKey="property" type="category" width={100} tick={{ fontSize: 9, fill: "#64748B" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="recebido" name="Receita Total" fill="#10B981" radius={[0, 4, 4, 0]} maxBarSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Rentals Table Section */}
      <RentalsTable 
        rentals={dashboardData.rentals} 
        onSelectRent={handleSelectRent} 
      />

      {/* Slide-over Drawer for Tenant Details */}
      <RentalsDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        selectedRent={selectedRent} 
        observationsText={observationsText} 
        setObservationsText={setObservationsText} 
        savingObservations={savingObservations} 
        onSaveObservations={handleSaveObservations} 
        onOpenEditMonth={handleOpenEditMonthModal} 
      />

      {/* Edit Rent Month Modal integration */}
      {isEditMonthModalOpen && selectedMonth && (
        <ModalEditMonthRent
          rentId={selectedMonth.rentId}
          rentMonthId={selectedMonth.rentMonthId}
          month={selectedMonth.monthName}
          amount={selectedMonth.amount}
          closeModal={handleCloseEditMonthModal}
        />
      )}
    </main>
  );
}
