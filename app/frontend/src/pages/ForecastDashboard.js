import { useEffect, useState } from "react";
import axiosRepositoryInstance from "../repository/AxiosRepository";
import styles from "./ForecastDashboard.module.css";
import priceBRL from "../utils/formatPrice";
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
} from "recharts";
import { toast } from "react-toastify";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip} style={{ background: "white", padding: "16px", border: "1px solid #E2E8F0", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}>
        <div style={{ fontWeight: "bold", marginBottom: "8px", color: "#1E293B" }}>{label}</div>
        {payload.map((entry, index) => (
          <div key={index} style={{ color: entry.color, fontWeight: "bold", fontSize: "14px", marginTop: "4px" }}>
            {entry.name}: {priceBRL(entry.value)}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

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
    timeline
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

      {/* Bailout / Bankruptcy Alert */}
      {data.bankruptMonthIndex && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "12px", padding: "20px", marginBottom: "24px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
          <div style={{ fontSize: "24px" }}>⚠️</div>
          <div>
            <h3 style={{ color: "#991B1B", margin: "0 0 8px 0" }}>Atenção Crítica: Quebra de Caixa Detectada</h3>
            <p style={{ color: "#7F1D1D", margin: 0, fontSize: "15px" }}>
              Mantendo as projeções atuais, seu caixa ficará negativo (<strong>{priceBRL(data.projectedDebt)}</strong>) em <strong>{data.bankruptDate}</strong>.
            </p>
            {data.bailoutPlan && (
              <div style={{ marginTop: "12px", background: "#FFF", padding: "12px", borderRadius: "8px", border: "1px dashed #FCA5A5" }}>
                <strong style={{ color: "#DC2626", display: "block", marginBottom: "4px" }}>💡 Plano de Resgate Sugerido pela IA:</strong>
                <span style={{ color: "#450A0A", fontSize: "14px" }}>{data.bailoutPlan}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Liquidez Atual (Caixa)</span>
          <span className={styles.kpiValue} style={{ color: "#5E17EB" }}>{priceBRL(currentBalance)}</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Patrimônio Líquido Atual</span>
          <span className={styles.kpiValue} style={{ color: "#10B981" }}>{priceBRL(currentEquity)}</span>
        </div>
        <div className={`${styles.kpiCard} ${bankruptMonthIndex ? styles.danger : styles.warning}`}>
          <span className={styles.kpiLabel}>Alerta de Fluxo de Caixa</span>
          <span className={`${styles.kpiValue} ${bankruptMonthIndex ? styles.dangerText : styles.warningText}`}>
            {bankruptMonthIndex ? `Risco de Quebra em ${bankruptDate}` : "Fluxo Saudável"}
          </span>
        </div>
      </div>



      {/* Mega Modal DRE do Gráfico */}
      {detailsModalMonth && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "40px" }}>
          <div style={{ background: "white", padding: "32px", borderRadius: "16px", width: "100%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", borderBottom: "2px solid #E2E8F0", paddingBottom: "16px" }}>
              <div>
                <h2 style={{ fontSize: "24px", color: "#0F172A", margin: 0 }}>DRE Detalhada: {detailsModalMonth.date}</h2>
                <span style={{ color: "#64748B", fontSize: "14px" }}>Demonstrativo de Resultado de Exercício</span>
              </div>
              <button onClick={() => setDetailsModalMonth(null)} style={{ background: "#F1F5F9", border: "none", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", fontSize: "18px", fontWeight: "bold", color: "#64748B" }}>✕</button>
            </div>
            
            <div style={{ display: "flex", gap: "24px", marginBottom: "32px" }}>
              <div style={{ flex: 1, padding: "20px", background: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0", textAlign: "center" }}>
                <span style={{ color: "#64748B", fontSize: "14px", display: "block", marginBottom: "8px" }}>Receitas do Mês</span>
                <strong style={{ fontSize: "24px", color: "#10B981" }}>{priceBRL(detailsModalMonth.incomes)}</strong>
              </div>
              <div style={{ flex: 1, padding: "20px", background: "#F8FAFC", borderRadius: "12px", border: "1px solid #E2E8F0", textAlign: "center" }}>
                <span style={{ color: "#64748B", fontSize: "14px", display: "block", marginBottom: "8px" }}>Despesas do Mês</span>
                <strong style={{ fontSize: "24px", color: "#EF4444" }}>{priceBRL(detailsModalMonth.expenses)}</strong>
              </div>
              <div style={{ flex: 1, padding: "20px", background: "#EDE9FE", borderRadius: "12px", border: "1px solid #C4B5FD", textAlign: "center" }}>
                <span style={{ color: "#5E17EB", fontSize: "14px", display: "block", marginBottom: "8px", fontWeight: "bold" }}>Saldo Projetado</span>
                <strong style={{ fontSize: "24px", color: detailsModalMonth.projectedBalance < 0 ? "#EF4444" : "#5E17EB" }}>{priceBRL(detailsModalMonth.projectedBalance)}</strong>
              </div>
            </div>

            <h3 style={{ marginBottom: "16px", color: "#1E293B" }}>Transações Agendadas</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F1F5F9", color: "#475569", fontSize: "13px", textAlign: "left" }}>
                  <th style={{ padding: "12px 16px", borderRadius: "8px 0 0 8px" }}>Descrição</th>
                  <th style={{ padding: "12px 16px" }}>Categoria</th>
                  <th style={{ padding: "12px 16px", textAlign: "right", borderRadius: "0 8px 8px 0" }}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {detailsModalMonth.detailedTransactions && detailsModalMonth.detailedTransactions.map((tx, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #E2E8F0" }}>
                    <td style={{ padding: "16px", fontWeight: "bold", color: "#334155" }}>
                      {tx.source} <span style={{fontSize: '11px', color: '#94A3B8', marginLeft: '8px'}}>Dia {tx.day}</span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span style={{ padding: "6px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold", background: tx.type === "INCOME" ? "#DCFCE7" : "#FEE2E2", color: tx.type === "INCOME" ? "#166534" : "#991B1B" }}>
                        {tx.type === "INCOME" ? "RECEITA" : "DESPESA"}
                      </span>
                    </td>
                    <td style={{ padding: "16px", textAlign: "right", fontWeight: "bold", color: tx.type === "INCOME" ? "#10B981" : "#EF4444", fontSize: "16px" }}>
                      {tx.type === "INCOME" ? "+" : "-"} {priceBRL(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Painel de Simulador (Stress Test) */}
      <section className={styles.chartSection} style={{ marginTop: "24px", background: activeScenario ? "#FEF2F2" : "#F8FAFC", border: activeScenario ? "2px solid #EF4444" : "1px dashed #CBD5E1", transition: "all 0.3s" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h3 style={{ color: activeScenario ? "#991B1B" : "#334155", display: "flex", alignItems: "center", gap: "8px" }}>
              🧪 Simulador de Cenários (Stress Test) 
              {activeScenario && <span style={{ fontSize: "12px", background: "#EF4444", color: "white", padding: "2px 8px", borderRadius: "12px" }}>ATIVO</span>}
            </h3>
            <p style={{ color: "#64748B", fontSize: "14px", margin: 0 }}>Ative os cenários abaixo para visualizar como seu fluxo de caixa e patrimônio reagiriam a eventos inesperados.</p>
          </div>
          {activeScenario && (
            <button onClick={() => setActiveScenario(null)} style={{ padding: "8px 16px", background: "#334155", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
              Voltar para Realidade (Limpar Cenário)
            </button>
          )}
        </div>
        
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <button onClick={() => setActiveScenario("LOSS_JOB")} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "12px 16px", background: activeScenario === "LOSS_JOB" ? "#FEE2E2" : "white", border: activeScenario === "LOSS_JOB" ? "2px solid #EF4444" : "1px solid #E2E8F0", borderRadius: "8px", cursor: "pointer", flex: 1, minWidth: "200px" }}>
            <span style={{ fontWeight: "bold", color: "#EF4444" }}>Perda de Emprego</span>
            <span style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>Zera o Salário (Recorrentes) a partir de agora.</span>
          </button>

          <button onClick={() => setActiveScenario("SELL_CAR")} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "12px 16px", background: activeScenario === "SELL_CAR" ? "#D1FAE5" : "white", border: activeScenario === "SELL_CAR" ? "2px solid #10B981" : "1px solid #E2E8F0", borderRadius: "8px", cursor: "pointer", flex: 1, minWidth: "200px" }}>
            <span style={{ fontWeight: "bold", color: "#10B981" }}>Venda de Veículo</span>
            <span style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>Injeta R$ 50k de liquidez imediata no caixa.</span>
          </button>

          <button onClick={() => setActiveScenario("NEW_BABY")} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "12px 16px", background: activeScenario === "NEW_BABY" ? "#FEF3C7" : "white", border: activeScenario === "NEW_BABY" ? "2px solid #F59E0B" : "1px solid #E2E8F0", borderRadius: "8px", cursor: "pointer", flex: 1, minWidth: "200px" }}>
            <span style={{ fontWeight: "bold", color: "#F59E0B" }}>Filho Inesperado</span>
            <span style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>Aumenta o Custo Fixo em R$ 3.000 mensais.</span>
          </button>
        </div>
      </section>

      {/* Main Dual Chart */}
      <section className={styles.chartSection}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h3 style={{ margin: 0 }}>Evolução: Liquidez vs Patrimônio Líquido</h3>
            <div style={{ fontSize: "13px", color: "#64748B", marginTop: "12px", background: "#F8FAFC", padding: "12px", borderRadius: "8px", display: "inline-block", border: "1px solid #E2E8F0" }}>
              <div style={{ marginBottom: "8px" }}>
                <span style={{ color: "#5E17EB", fontWeight: "bold" }}>● Caixa Projetado:</span> Dinheiro real na sua conta bancária (Liquidez). Sobe com Receitas, desce com Despesas.
              </div>
              <div style={{ marginBottom: "8px" }}>
                <span style={{ color: "#EF4444", fontWeight: "bold" }}>● Saídas (Despesas):</span> Total de gastos do mês (Custos fixos + Parcelas de financiamento).
              </div>
              <div>
                <span style={{ color: "#10B981", fontWeight: "bold" }}>● Patrimônio Líquido (Equity):</span> Saldo do Caixa + Valor de Mercado dos Bens - Dívidas Restantes.
                <div style={{ marginTop: "4px", fontSize: "12px", color: "#94A3B8" }}>
                  <em>Cresce a cada parcela paga, pois sua dívida diminui e sua "fatia real" do bem aumenta.</em>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ display: "flex", background: "#F1F5F9", padding: "4px", borderRadius: "8px" }}>
              <button 
                onClick={() => setTimeFilter("FUTURE_ONLY")} 
                style={{ padding: "8px 16px", background: timeFilter === "FUTURE_ONLY" ? "white" : "transparent", color: timeFilter === "FUTURE_ONLY" ? "#0F172A" : "#64748B", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", boxShadow: timeFilter === "FUTURE_ONLY" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
                Projeção Futura
              </button>
              <button 
                onClick={() => setTimeFilter("ALL_HISTORY")} 
                style={{ padding: "8px 16px", background: timeFilter === "ALL_HISTORY" ? "white" : "transparent", color: timeFilter === "ALL_HISTORY" ? "#0F172A" : "#64748B", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", boxShadow: timeFilter === "ALL_HISTORY" ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
                Histórico Completo
              </button>
            </div>
            <button style={{ padding: "8px 16px", border: "1px solid #CBD5E1", background: "white", borderRadius: "8px", fontWeight: "bold", color: "#64748B", cursor: "pointer" }}>
              Exportar Relatório (PDF)
            </button>
          </div>
        </div>
        
        <div className={styles.chartContainer} style={{ height: "400px", marginTop: "24px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={filteredTimeline} 
              margin={{ top: 20, right: 30, left: 20, bottom: 0 }}
              style={{ cursor: "pointer" }}
              onClick={(e) => {
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
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} tickFormatter={(val) => `R$ ${val/1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36}/>
              <ReferenceLine y={0} stroke="#EF4444" strokeDasharray="3 3" />
              <Area type="monotone" name="Caixa Projetado" dataKey="projectedBalance" stroke={bankruptMonthIndex ? "#F97316" : "#5E17EB"} strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
              <Area type="monotone" name="Patrimônio Líquido (Equity)" dataKey="projectedEquity" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorEquity)" />
              <Area type="monotone" name="Saídas (Despesas)" dataKey="expenses" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Tabela Master-Detail */}
      <section id="details-section" className={styles.chartSection} style={{ marginTop: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h3>Demonstração do Resultado Mês a Mês</h3>
            <p style={{ color: "#64748B", fontSize: "14px", marginTop: "4px" }}>Expanda um mês para ver a DRE detalhada de todas as entradas e saídas.</p>
          </div>
          
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{ padding: "10px 16px", borderRadius: "8px", border: "1px solid #CBD5E1", fontWeight: "bold", outline: "none", cursor: "pointer", background: "#F8FAFC" }}
          >
            {availableYears.map(y => (
              <option key={y} value={y}>Filtrar Ano: {y}</option>
            ))}
          </select>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {timelineToShow.map((month, index) => {
            const isExpanded = expandedDate === month.date;
            const isNegative = month.projectedBalance < 0;

            return (
              <div key={index} style={{ border: `1px solid ${isExpanded ? "#5E17EB" : "#E2E8F0"}`, borderRadius: "12px", overflow: "hidden", background: isExpanded ? "#F8FAFC" : "white" }}>
                {/* Header (Resumo) */}
                <div 
                  onClick={() => setExpandedDate(isExpanded ? null : month.date)}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", cursor: "pointer", background: isExpanded ? "#EDE9FE" : "transparent" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", width: "200px" }}>
                    {isExpanded ? <FaChevronUp color="#5E17EB" /> : <FaChevronDown color="#64748B" />}
                    <strong style={{ fontSize: "16px", color: "#1E293B" }}>{month.date}</strong>
                  </div>
                  
                  <div style={{ display: "flex", gap: "48px", flex: 1, justifyContent: "center" }}>
                    <div style={{ textAlign: "center" }}>
                      <span style={{ fontSize: "12px", color: "#64748B", display: "block" }}>Entradas Totais</span>
                      <strong style={{ color: "#10B981" }}>{priceBRL(month.incomes)}</strong>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <span style={{ fontSize: "12px", color: "#64748B", display: "block" }}>Saídas Totais</span>
                      <strong style={{ color: "#EF4444" }}>{priceBRL(month.expenses)}</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: "right", width: "200px" }}>
                    <span style={{ fontSize: "12px", color: "#64748B", display: "block" }}>Saldo Final Estimado</span>
                    <strong style={{ fontSize: "18px", color: isNegative ? "#EF4444" : "#0F172A" }}>{priceBRL(month.projectedBalance)}</strong>
                  </div>
                </div>

                {/* Body (Detalhamento - DRE) */}
                {isExpanded && (
                  <div style={{ padding: "24px", borderTop: "1px solid #E2E8F0" }}>
                    <h4 style={{ color: "#1E293B", marginBottom: "16px" }}>Detalhamento Contábil (DRE Projetada)</h4>
                    
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "2px solid #E2E8F0", color: "#64748B", fontSize: "12px", textAlign: "left" }}>
                          <th style={{ paddingBottom: "8px" }}>Categoria/Origem</th>
                          <th style={{ paddingBottom: "8px" }}>Classificação</th>
                          <th style={{ paddingBottom: "8px", textAlign: "right" }}>Impacto no Caixa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {month.detailedTransactions && month.detailedTransactions.map((tx, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                            <td style={{ padding: "12px 0", fontWeight: "bold", color: "#334155" }}>
                              {tx.source} <span style={{fontSize: '11px', color: '#94A3B8', marginLeft: '8px'}}>Dia {tx.day}</span>
                            </td>
                            <td style={{ padding: "12px 0" }}>
                              <span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", background: tx.type === "INCOME" ? "#DCFCE7" : "#FEE2E2", color: tx.type === "INCOME" ? "#166534" : "#991B1B" }}>
                                {tx.type === "INCOME" ? "RECEITA" : "DESPESA"}
                              </span>
                            </td>
                            <td style={{ padding: "12px 0", textAlign: "right", fontWeight: "bold", color: tx.type === "INCOME" ? "#10B981" : "#EF4444" }}>
                              {tx.type === "INCOME" ? "+" : "-"} {priceBRL(tx.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px", paddingTop: "16px", borderTop: "2px dashed #CBD5E1" }}>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ color: "#64748B", fontSize: "14px" }}>Resultado Líquido do Mês: <strong style={{ color: (month.incomes - month.expenses) >= 0 ? "#10B981" : "#EF4444" }}>{(month.incomes - month.expenses) >= 0 ? "+ " : "- "}{priceBRL(Math.abs(month.incomes - month.expenses))}</strong></div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ color: "#64748B", fontSize: "14px" }}>Crescimento de Patrimônio (Equity) Adicionado: <strong style={{ color: "#10B981" }}>+ {priceBRL(month.composition?.patrimonyInstallments || 0)}</strong></div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
