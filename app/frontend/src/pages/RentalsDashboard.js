import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useFinance } from "../hooks/useFinance";
import axiosRepositoryInstance from "../repository/AxiosRepository";
import priceBRL from "../utils/formatPrice";
import { getMonthName } from "../utils/formatDate";
import ModalEditMonthRent from "../components/financeDetails/ModalEditMonthRent";
import { toast } from "react-toastify";

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

  // Table filtering and search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [sortBy, setSortBy] = useState("tenant");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  // Filter & Sort table data
  const filteredRentals = useMemo(() => {
    if (!dashboardData) return [];
    let list = [...dashboardData.rentals];

    // Search filter
    if (search.trim() !== "") {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.tenant.toLowerCase().includes(q) ||
          r.street.toLowerCase().includes(q) ||
          r.streetNumber.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== "Todos") {
      list = list.filter((r) => r.status === statusFilter);
    }

    // Sorting
    list.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === "value" || sortBy === "totalPaid" || sortBy === "totalDebt") {
        valA = parseFloat(valA) || 0;
        valB = parseFloat(valB) || 0;
      } else {
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [dashboardData, search, statusFilter, sortBy, sortOrder]);

  // Paginated data
  const paginatedRentals = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRentals.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRentals, currentPage]);

  const totalPages = Math.ceil(filteredRentals.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
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
      <section className={styles.kpiGrid} aria-label="Resumo Financeiro Geral">
        <article className={`${styles.kpiCard} ${styles.kpiReceived}`}>
          <div className={styles.kpiIconWrapper}>
            <FaMoneyBillWave />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Recebido no Mês</span>
            <h2 className={styles.kpiValue}>{priceBRL(summary.totalReceivedThisMonth)}</h2>
            <span className={styles.kpiSubtitle}>Entradas deste mês</span>
          </div>
        </article>

        <article className={`${styles.kpiCard} ${styles.kpiPending}`}>
          <div className={styles.kpiIconWrapper}>
            <FaClock />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Total Pendente (Mês)</span>
            <h2 className={styles.kpiValue}>{priceBRL(summary.totalPendingThisMonth)}</h2>
            <span className={styles.kpiSubtitle}>A receber neste mês</span>
          </div>
        </article>

        <article className={`${styles.kpiCard} ${styles.kpiOverdue}`}>
          <div className={styles.kpiIconWrapper}>
            <FaExclamationTriangle />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Inquilinos Inadimplentes</span>
            <h2 className={styles.kpiValue}>{summary.defaultingTenantsCount}</h2>
            <span className={styles.kpiSubtitle}>Contratos em atraso</span>
          </div>
        </article>

        <article className={`${styles.kpiCard} ${styles.kpiForecast}`}>
          <div className={styles.kpiIconWrapper}>
            <FaCalendarAlt />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Previsto Próximo Mês</span>
            <h2 className={styles.kpiValue}>{priceBRL(summary.expectedIncomeNextMonth)}</h2>
            <span className={styles.kpiSubtitle}>Próximo faturamento</span>
          </div>
        </article>

        <article className={`${styles.kpiCard} ${styles.kpiRented}`}>
          <div className={styles.kpiIconWrapper}>
            <FaBuilding />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Imóveis Alugados</span>
            <h2 className={styles.kpiValue}>{summary.totalPropertiesRented}</h2>
            <span className={styles.kpiSubtitle}>Contratos ativos</span>
          </div>
        </article>

        <article className={`${styles.kpiCard} ${styles.kpiRate}`}>
          <div className={styles.kpiIconWrapper}>
            <FaPercentage />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Taxa de Inadimplência</span>
            <h2 className={styles.kpiValue}>{summary.delinquencyRate}%</h2>
            <span className={styles.kpiSubtitle}>Proporção de atrasos</span>
          </div>
        </article>

        <article className={`${styles.kpiCard} ${styles.kpiAnnual}`}>
          <div className={styles.kpiIconWrapper}>
            <FaChartBar />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Receita Anual Prevista</span>
            <h2 className={styles.kpiValue}>{priceBRL(summary.expectedAnnualRevenue)}</h2>
            <span className={styles.kpiSubtitle}>Estimativa para 12 meses</span>
          </div>
        </article>

        <article className={`${styles.kpiCard} ${styles.kpiOpen}`}>
          <div className={styles.kpiIconWrapper}>
            <FaFileInvoiceDollar />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Valor Total em Aberto</span>
            <h2 className={styles.kpiValue}>{priceBRL(summary.totalOpenValue)}</h2>
            <span className={styles.kpiSubtitle}>Dívida acumulada total</span>
          </div>
        </article>

        <article className={`${styles.kpiCard} ${styles.kpiGross}`}>
          <div className={styles.kpiIconWrapper}>
            <FaDollarSign />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Ganho Bruto Histórico</span>
            <h2 className={styles.kpiValue}>{priceBRL(summary.totalGrossIncome)}</h2>
            <span className={styles.kpiSubtitle}>Faturamento bruto total</span>
          </div>
        </article>

        <article className={`${styles.kpiCard} ${styles.kpiNet}`}>
          <div className={styles.kpiIconWrapper}>
            <FaChartLine />
          </div>
          <div className={styles.kpiInfo}>
            <span className={styles.kpiLabel}>Ganho Líquido Histórico</span>
            <h2 className={styles.kpiValue}>{priceBRL(summary.totalNetIncome)}</h2>
            <span className={styles.kpiSubtitle}>Faturamento líquido total</span>
          </div>
        </article>
      </section>

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
      <section className={styles.tableSection}>
        <div className={styles.tableControls}>
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por inquilino ou endereço..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className={styles.filterBox}>
            <div className={styles.filterItem}>
              <FaFilter className={styles.controlIcon} />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="Todos">Todos os Status</option>
                <option value="Pago">Pago</option>
                <option value="Pendente">Pendente</option>
                <option value="Atrasado">Atrasado</option>
              </select>
            </div>

            <div className={styles.filterItem}>
              <FaSort className={styles.controlIcon} />
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-");
                  setSortBy(field);
                  setSortOrder(order);
                  setCurrentPage(1);
                }}
              >
                <option value="tenant-asc">Inquilino (A-Z)</option>
                <option value="tenant-desc">Inquilino (Z-A)</option>
                <option value="value-asc">Valor (Menor-Maior)</option>
                <option value="value-desc">Valor (Maior-Menor)</option>
                <option value="totalDebt-desc">Maior Dívida</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th onClick={() => handleSort("tenant")}>
                  Inquilino / Imóvel {sortBy === "tenant" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("value")}>
                  Valor do Aluguel {sortBy === "value" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th>Status do Mês</th>
                <th onClick={() => handleSort("totalPaid")}>
                  Total Pago {sortBy === "totalPaid" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th onClick={() => handleSort("totalDebt")}>
                  Em Aberto {sortBy === "totalDebt" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th>Último Pagamento</th>
                <th>Próximo Vencimento</th>
                <th className={styles.actionsHeader}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRentals.map((rent) => {
                const rentVal = parseFloat(rent.value) || 0;
                const paidRatio = rentVal > 0 ? (rent.totalPaid / (rent.totalPaid + rent.totalDebt)) * 100 : 0;

                return (
                  <tr
                    key={rent.id}
                    className={`${styles.tableRow} ${rent.status === "Atrasado" ? styles.rowOverdue : ""}`}
                    onClick={() => handleSelectRent(rent)}
                  >
                    <td>
                      <div className={styles.tenantCell}>
                        <span className={styles.tenantName}>{rent.tenant}</span>
                        <span className={styles.propertyAddress}>
                          {rent.street}, {rent.streetNumber}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.rentValue}>{priceBRL(rentVal)}</span>
                    </td>
                    <td>
                      <span
                        className={`${styles.statusTag} ${
                          rent.status === "Pago"
                            ? styles.tagPaid
                            : rent.status === "Atrasado"
                            ? styles.tagOverdue
                            : styles.tagPending
                        }`}
                      >
                        {rent.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.progressCell}>
                        <span>{priceBRL(rent.totalPaid)}</span>
                        <div className={styles.progressBarBg}>
                          <div
                            className={styles.progressBarFill}
                            style={{
                              width: `${Math.min(paidRatio, 100)}%`,
                              backgroundColor: rent.status === "Atrasado" ? "var(--danger)" : "var(--success)",
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={rent.totalDebt > 0 ? styles.textDebt : styles.textZeroDebt}>
                        {priceBRL(rent.totalDebt)}
                      </span>
                    </td>
                    <td>{rent.lastPaymentDate}</td>
                    <td>
                      <span className={rent.status === "Atrasado" ? styles.dueDateAlert : ""}>
                        {rent.nextDue}
                      </span>
                    </td>
                    <td className={styles.actionsCell} onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleSelectRent(rent)} className={styles.btnActionDetail}>
                        Detalhes
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredRentals.length === 0 && (
                <tr>
                  <td colSpan={8} className={styles.noDataCell}>
                    Nenhum aluguel encontrado com os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={styles.paginationBtn}
            >
              Anterior
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={styles.paginationBtn}
            >
              Próxima
            </button>
          </div>
        )}
      </section>

      {/* Slide-over Drawer for Tenant Details */}
      <div className={`${styles.drawerOverlay} ${isDrawerOpen ? styles.drawerOverlayOpen : ""}`} onClick={() => setIsDrawerOpen(false)}>
        <aside className={`${styles.drawer} ${isDrawerOpen ? styles.drawerOpen : ""}`} onClick={(e) => e.stopPropagation()}>
          {selectedRent ? (
            <div className={styles.drawerContent}>
              <header className={styles.drawerHeader}>
                <div>
                  <h2>Ficha do Inquilino</h2>
                  <p>Informações contratuais e financeiras</p>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className={styles.btnCloseDrawer}>
                  <FaTimes />
                </button>
              </header>

              <main className={styles.drawerBody}>
                {/* Profile and Property Info */}
                <section className={styles.drawerSection}>
                  <div className={styles.drawerProfile}>
                    <div className={styles.drawerAvatar}>
                      {selectedRent.tenant.substring(0, 2).toUpperCase()}
                    </div>
                    <div className={styles.drawerProfileInfo}>
                      <h3>{selectedRent.tenant}</h3>
                      <span className={`${styles.statusTag} ${
                        selectedRent.status === "Pago"
                          ? styles.tagPaid
                          : selectedRent.status === "Atrasado"
                          ? styles.tagOverdue
                          : styles.tagPending
                      }`}>{selectedRent.status}</span>
                    </div>
                  </div>

                  <div className={styles.infoList}>
                    <div className={styles.infoItem}>
                      <FaMapMarkerAlt className={styles.infoIcon} />
                      <div>
                        <strong>Imóvel</strong>
                        <span>{selectedRent.street}, {selectedRent.streetNumber}</span>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <FaCalendarAlt className={styles.infoIcon} />
                      <div>
                        <strong>Início do Contrato</strong>
                        <span>{selectedRent.startRental}</span>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <FaDollarSign className={styles.infoIcon} />
                      <div>
                        <strong>Valor Mensal do Aluguel</strong>
                        <span>{priceBRL(parseFloat(selectedRent.value) || 0)}</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Individual Summary Cards */}
                <section className={styles.drawerSection}>
                  <h4 className={styles.sectionHeading}>Resumo Financeiro Individual</h4>
                  <div className={styles.miniCardGrid}>
                    <div className={styles.miniCard}>
                      <span>Total Pago</span>
                      <h5>{priceBRL(selectedRent.totalPaid)}</h5>
                    </div>
                    <div className={styles.miniCard}>
                      <span>Total em Atraso</span>
                      <h5 style={{ color: selectedRent.totalDebt > 0 ? "var(--danger)" : "var(--text-muted)" }}>
                        {priceBRL(selectedRent.totalDebt)}
                      </h5>
                    </div>
                    <div className={styles.miniCard}>
                      <span>Meses Pagos</span>
                      <h5>{selectedRent.months.filter(m => m.paid).length} meses</h5>
                    </div>
                    <div className={styles.miniCard}>
                      <span>Meses em Aberto</span>
                      <h5>{selectedRent.months.filter(m => !m.paid).length} meses</h5>
                    </div>
                  </div>
                </section>

                {/* Notes/Observations */}
                <section className={styles.drawerSection}>
                  <h4 className={styles.sectionHeading}>
                    <FaRegClipboard /> Observações do Contrato
                  </h4>
                  <div className={styles.notesContainer}>
                    <textarea
                      placeholder="Adicione observações, anotações de reajuste ou datas importantes sobre o aluguel..."
                      value={observationsText}
                      onChange={(e) => setObservationsText(e.target.value)}
                      rows={4}
                    />
                    <button
                      onClick={handleSaveObservations}
                      disabled={savingObservations}
                      className={styles.btnSaveNotes}
                    >
                      {savingObservations ? "Salvando..." : <><FaSave /> Salvar Observações</>}
                    </button>
                  </div>
                </section>

                {/* Timeline of Payments */}
                <section className={styles.drawerSection}>
                  <h4 className={styles.sectionHeading}>
                    <FaHistory /> Linha do Tempo Financeira
                  </h4>
                  <p className={styles.timelineDesc}>Clique em um mês para editar pagamentos, despesas ou comprovantes.</p>
                  
                  <div className={styles.timeline}>
                    {selectedRent.months.map((month, idx) => {
                      const outstanding = month.difference;
                      const monthName = getMonthName(month.dateMonth);

                      return (
                        <div
                          key={month.id}
                          className={`${styles.timelineItem} ${month.paid ? styles.timelinePaid : styles.timelineUnpaid}`}
                          onClick={() => handleOpenEditMonthModal(month)}
                        >
                          <div className={styles.timelinePoint} />
                          <div className={styles.timelineHeader}>
                            <span className={styles.timelineMonth}>{monthName}</span>
                            <span className={`${styles.timelineBadge} ${month.paid ? styles.badgePaid : styles.badgeUnpaid}`}>
                              {month.paid ? "PAGO" : "PENDENTE"}
                            </span>
                          </div>
                          <div className={styles.timelineDetails}>
                            <div>
                              <span>Recebido: {priceBRL(month.amountPaid)}</span>
                              {outstanding > 0 && (
                                <span className={styles.timelineDebt}> Ouve-se: {priceBRL(outstanding)}</span>
                              )}
                            </div>
                            {month.expenses.length > 0 && (
                              <div className={styles.timelineExpenses}>
                                despesas: {priceBRL(month.expenses.reduce((s, e) => s + e.amount, 0))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </main>
            </div>
          ) : (
            <div className={styles.drawerEmpty}>
              <FaInfoCircle />
              <p>Selecione um inquilino para ver a ficha detalhada.</p>
            </div>
          )}
        </aside>
      </div>

      {/* Edit Rent Month Modal integration */}
      {isEditMonthModalOpen && selectedMonth && (
        <ModalEditMonthRent
          rentId={selectedMonth.rentId}
          rentMonthId={selectedMonth.rentMonthId}
          month={selectedMonth.monthName}
          paid={selectedMonth.paid}
          amount={selectedMonth.amount}
          closeModal={handleCloseEditMonthModal}
        />
      )}
    </main>
  );
}
