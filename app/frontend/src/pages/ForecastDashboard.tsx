// @ts-nocheck
import { useEffect, useState } from "react";
import axiosRepositoryInstance from "../repository/AxiosRepository";
import styles from "./ForecastDashboard.module.css";
import { toast } from "react-toastify";

import { ForecastAlerts } from "./ForecastDashboardComponents/ForecastAlerts";
import { ForecastKPIs } from "./ForecastDashboardComponents/ForecastKPIs";
import { ForecastSimulator } from "./ForecastDashboardComponents/ForecastSimulator";
import { ForecastChart } from "./ForecastDashboardComponents/ForecastChart";
import { ForecastTimeline } from "./ForecastDashboardComponents/ForecastTimeline";
import { ForecastDREModal } from "./ForecastDashboardComponents/ForecastDREModal";

export function ForecastDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedDate, setExpandedDate] = useState(null);
  const [activeScenario, setActiveScenario] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [detailsModalMonth, setDetailsModalMonth] = useState(null);
  const [timeFilter, setTimeFilter] = useState("FUTURE_ONLY");

  const fetchForecast = async (scenario = null) => {
    try {
      setLoading(true);
      const response = await axiosRepositoryInstance.getForecastDashboard(scenario);
      setData(response.data);
    } catch (err) {
      toast.error("Erro ao carregar projeções financeiras.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast(activeScenario);
  }, [activeScenario]);

  if (loading) {
    return <div className={styles.container}><div className={styles.loading}>Analisando matriz financeira...</div></div>;
  }

  if (!data) return null;

  const {
    currentBalance,
    currentEquity,
    projectionMonths,
    bankruptMonthIndex,
    bankruptDate,
    projectedDebt,
    timeline,
    bailoutPlan
  } = data;

  const filteredTimeline = timeFilter === "FUTURE_ONLY" ? timeline.filter(m => m.monthIndex >= 0) : timeline;
  const availableYears = [...new Set(filteredTimeline.map(m => Number(m.date.split('/')[1])))].sort();
  const timelineToShow = filteredTimeline.filter(m => Number(m.date.split('/')[1]) === selectedYear);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Projeção Financeira & Patrimonial</h1>
        <p className={styles.subtitle}>
          Visualizando os próximos {projectionMonths} meses. Entenda exatamente como seu Caixa (Liquidez) e sua Riqueza Real (Equity) se comportarão no futuro.
        </p>
      </header>

      <ForecastAlerts 
        bankruptMonthIndex={bankruptMonthIndex}
        projectedDebt={projectedDebt}
        bankruptDate={bankruptDate}
        bailoutPlan={bailoutPlan}
      />

      <ForecastKPIs 
        currentBalance={currentBalance}
        currentEquity={currentEquity}
        bankruptMonthIndex={bankruptMonthIndex}
        bankruptDate={bankruptDate}
      />

      <ForecastDREModal 
        detailsModalMonth={detailsModalMonth}
        setDetailsModalMonth={setDetailsModalMonth}
      />

      <ForecastSimulator 
        activeScenario={activeScenario}
        setActiveScenario={setActiveScenario}
      />

      <ForecastChart 
        filteredTimeline={filteredTimeline}
        bankruptMonthIndex={bankruptMonthIndex}
        timeline={timeline}
        setDetailsModalMonth={setDetailsModalMonth}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
      />

      <ForecastTimeline 
        availableYears={availableYears}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        timelineToShow={timelineToShow}
        expandedDate={expandedDate}
        setExpandedDate={setExpandedDate}
      />

    </div>
  );
}
