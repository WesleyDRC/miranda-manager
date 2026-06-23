import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosRepositoryInstance from "../repository/AxiosRepository";
import styles from "./TreasuryDetail.module.css";
import priceBRL from "../utils/formatPrice";
import { toast } from "react-toastify";
import { KpiCard } from "../components/dashboard/components/KpiCard";
import { Table } from "../components/ui/Table";
import { DashboardChart } from "../components/dashboard/components/DashboardChart";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export function TreasuryDetail() {
  const { name } = useParams<{ name: string }>();
  const decodedName = name ? decodeURIComponent(name) : "";
  const navigate = useNavigate();

  const [groupTreasuries, setGroupTreasuries] = useState<any[]>([]);
  const [groupMovements, setGroupMovements] = useState<any[]>([]);
  const [groupSnapshots, setGroupSnapshots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states for NEW APORTE (Create Treasury) or RESGATE
  const [movementType, setMovementType] = useState('DEPOSIT');
  const [amount, setAmount] = useState("");
  const [movementDate, setMovementDate] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [fixedRate, setFixedRate] = useState("");
  const [ipcaRate, setIpcaRate] = useState("4.50");
  const [selicRate, setSelicRate] = useState("10.50");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [description, setDescription] = useState("");

  const [activeChartTab, setActiveChartTab] = useState('HISTORICO');

  const fetchData = async () => {
    try {
      console.log("fetch data")
      if (!decodedName) return;

      const tRes = await axiosRepositoryInstance.getTreasuries();
      console.log("tRes")
      console.log(tRes)
      const allTreasuries = tRes.data.investments || [];
      const matchingTreasuries = allTreasuries.filter((t: any) => t.titleName === decodedName);

      if (matchingTreasuries.length === 0) {
        toast.error("Título não encontrado.");
        navigate("/investments/treasury");
        return;
      }

      setGroupTreasuries(matchingTreasuries);

      // Fetch movements and snapshots for all matching IDs
      const movPromises = matchingTreasuries.map((t: any) => axiosRepositoryInstance.getTreasuryMovements(t.id));
      const snapPromises = matchingTreasuries.map((t: any) => axiosRepositoryInstance.getTreasurySnapshots(t.id));

      const movResponses = await Promise.all(movPromises);
      const snapResponses = await Promise.all(snapPromises);

      let allMovements: any[] = [];
      // Injeta os aportes iniciais de cada contrato como movimentações artificiais
      matchingTreasuries.forEach((t: any) => {
          allMovements.push({
              id: `initial-${t.id}`,
              movementDate: t.purchaseDate,
              movementType: 'DEPOSIT',
              amount: t.investedAmount,
              description: 'Aporte Inicial (Contrato)',
              treasuryId: t.id,
              annualRate: t.annualRate,
              monthlyEstimatedRate: t.monthlyEstimatedRate,
              currentValue: t.currentValue,
              marketValue: t.marketValue,
              marketUnitPrice: t.marketUnitPrice,
              quantity: t.quantity,
              unitPrice: t.unitPrice,
              taxes: t.taxes
          });
      });

      movResponses.forEach(res => {
          if (res.data.movements) allMovements = [...allMovements, ...res.data.movements];
      });

      let allSnapshots: any[] = [];
      snapResponses.forEach(res => {
          if (res.data.snapshots) allSnapshots = [...allSnapshots, ...res.data.snapshots];
      });

      setGroupMovements(allMovements);
      setGroupSnapshots(allSnapshots);

    } catch (err) {
      toast.error("Erro ao carregar os dados do grupo de títulos.");
      navigate("/investments/treasury");
    } finally {
      setLoading(false);
    }
  };

  const fetchIpcaFocus = async () => {
    try {
      const response = await axiosRepositoryInstance.getIpcaFocus();
      if (response.data && response.data.value) {
        setIpcaRate(response.data.value.toFixed(2));
      }
    } catch (err) {
      console.warn("Could not fetch IPCA Focus, falling back to 4.50", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchIpcaFocus();
    // eslint-disable-next-line
  }, [decodedName]);

  const parseBrNumber = (val: string) => {
    if (!val) return undefined;
    let str = val.toString().trim();
    if (str.includes(',')) {
        str = str.replace(/\./g, "").replace(",", ".");
    }
    return Number(str);
  };

  const handleCreateMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !movementDate) {
      toast.warning("Preencha o valor e a data.");
      return;
    }

    const parsedAmount = parseBrNumber(amount) || 0;
    const parsedAnnualRate = parseBrNumber(annualRate) || 0;
    const parsedFixedRate = parseBrNumber(fixedRate) || 0;
    const parsedIpcaRate = parseBrNumber(ipcaRate) || 0;
    const parsedSelicRate = parseBrNumber(selicRate) || 0;
    const parsedQuantity = parseBrNumber(quantity);
    const parsedUnitPrice = parseBrNumber(unitPrice);

    try {
      if (movementType === "DEPOSIT") {
        const baseTreasury = groupTreasuries[0]; // Pega dados de base do primeiro
        const isIPCA = baseTreasury.treasuryType.includes('IPCA');
        const isSelic = baseTreasury.treasuryType.includes('SELIC');

        if (isIPCA) {
            if (!fixedRate || !ipcaRate) {
                toast.warning("Para aportes IPCA, informe a taxa fixa e a projeção.");
                return;
            }
        } else if (isSelic) {
            if (!fixedRate || !selicRate) {
                toast.warning("Para aportes Selic, informe a taxa fixa e a taxa Selic.");
                return;
            }
        } else {
            if (!annualRate) {
                toast.warning("Para aportes, você precisa informar a taxa contratada.");
                return;
            }
        }

        let finalAnnualRate = parsedAnnualRate;
        if (isIPCA) finalAnnualRate = parsedFixedRate + parsedIpcaRate;
        else if (isSelic) finalAnnualRate = parsedFixedRate + parsedSelicRate;

        await axiosRepositoryInstance.createTreasury({
          treasuryType: baseTreasury.treasuryType,
          titleName: decodedName,
          purchaseDate: new Date(movementDate).toISOString(),
          maturityDate: baseTreasury.maturityDate,
          investedAmount: parsedAmount,
          annualRate: finalAnnualRate,
          liquidityAvailable: baseTreasury.liquidityAvailable,
          quantity: parsedQuantity,
          unitPrice: parsedUnitPrice,
          notes: description
        });
        toast.success("Novo aporte registrado como um novo contrato!");

      } else {
        // Se for resgate, tiramos do contrato mais antigo (FIFO)
        const oldestTreasury = [...groupTreasuries].sort((a, b) => new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime())[0];

        await axiosRepositoryInstance.createTreasuryMovement({
          treasuryId: oldestTreasury.id,
          movementType: "WITHDRAW",
          amount: parsedAmount,
          movementDate: new Date(movementDate).toISOString(),
          description
        });
        toast.success("Resgate registrado no contrato mais antigo!");
      }

      setAmount("");
      setDescription("");
      setAnnualRate("");
      setFixedRate("");
      fetchIpcaFocus();
      setQuantity("");
      setUnitPrice("");
      fetchData(); // reload
    } catch (err) {
      toast.error("Erro ao registrar movimentação.");
    }
  };

  const handleDeleteMovement = async (m: any) => {
    if (window.confirm("Deseja realmente apagar esta movimentação?")) {
      try {
        if (m.id && m.id.startsWith("initial-")) {
            // Delete the treasury contract entirely
            await axiosRepositoryInstance.deleteTreasury({ id: m.treasuryId });
        } else {
            // Delete only the movement
            await axiosRepositoryInstance.deleteTreasuryMovement({ id: m.id });
        }
        toast.success("Movimentação apagada com sucesso!");
        fetchData();
      } catch (err) {
        toast.error("Erro ao apagar movimentação.");
      }
    }
  };

  const handleDeleteGroup = async () => {
    if (window.confirm("Deseja realmente deletar TODO o histórico e todos os aportes agrupados deste título?")) {
      try {
        const deletePromises = groupTreasuries.map(t => axiosRepositoryInstance.deleteTreasury({ id: t.id }));
        await Promise.all(deletePromises);
        toast.success("Grupo de títulos deletado com sucesso!");
        navigate("/investments/treasury");
      } catch (err) {
        toast.error("Erro ao deletar grupo de títulos.");
      }
    }
  };

  if (loading || groupTreasuries.length === 0) {
    return <div className={styles.loading}>Carregando consolidação...</div>;
  }

  // Agregações de KPI
  const currentValue = groupTreasuries.reduce((acc, t) => acc + (t.currentValue || 0), 0);
  const marketValue = groupTreasuries.reduce((acc, t) => acc + (t.marketValue || t.currentValue || 0), 0);
  const projectedValue = groupTreasuries.reduce((acc, t) => acc + (t.projectedValue || t.currentValue || 0), 0);
  const gainCurve = projectedValue - currentValue;
  const gainMarket = marketValue - groupTreasuries.reduce((acc, t) => acc + t.investedAmount, 0);

  const netMarketValue = groupTreasuries.reduce((acc, t) => {
    return acc + (t.taxes?.netValue || t.marketValue || t.currentValue || 0);
  }, 0);
  const netGainMarket = netMarketValue - groupTreasuries.reduce((acc, t) => acc + t.investedAmount, 0);

  const handleUpdateMarketPrice = async () => {
    const pu = window.prompt("Digite o Preço Unitário (PU) atual deste título na B3:\nVocê pode colar diretamente do site (Ex: 3.407,48)");
    if (!pu) return;
    
    // Remove todos os pontos (milhares) e troca a vírgula (decimal) por ponto
    const cleanedPu = pu.replace(/\./g, "").replace(",", ".");
    const puNumber = Number(cleanedPu);
    
    if (isNaN(puNumber) || puNumber <= 0) {
      toast.error("Preço inválido.");
      return;
    }

    try {
      await axiosRepositoryInstance.bulkUpdateTreasuryMarketPrice({
        titleName: decodedName,
        marketUnitPrice: puNumber
      });
      toast.success("Preço a mercado atualizado para todos os aportes deste título!");
      fetchData();
    } catch (err) {
      toast.error("Erro ao atualizar o PU a mercado.");
    }
  };

  const movementColumns = [
    { key: "movementDate", title: "Data Operação", render: (r: any) => new Date(r.movementDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) },
    { key: "movementType", title: "Tipo", render: (r: any) => r.movementType === 'DEPOSIT' ? 'Aporte' : r.movementType === 'WITHDRAW' ? 'Resgate' : 'Ajuste' },
    { key: "amount", title: "Valor Investido", render: (r: any) => <span style={{ color: r.movementType === 'WITHDRAW' ? '#EF4444' : '#10B981', fontWeight: 'bold' }}>{priceBRL(r.amount)}</span> },
    { key: "quantity", title: "Qtd.", render: (r: any) => r.quantity ? r.quantity : '-' },
    { key: "unitPrice", title: "PU Compra", render: (r: any) => r.unitPrice ? priceBRL(r.unitPrice) : '-' },
    { key: "annualRate", title: "Taxa Anual", render: (r: any) => r.annualRate ? `${Number(r.annualRate).toFixed(2)}%` : '-' },
    { key: "currentValue", title: "Valor Bruto (Curva)", render: (r: any) => r.currentValue ? <span style={{color: '#64748B'}}>{priceBRL(r.currentValue)}</span> : '-' },
    { key: "marketValue", title: "Valor Bruto (Mercado)", render: (r: any) => (r.marketValue || r.currentValue) ? <strong style={{color: '#5E17EB'}}>{priceBRL(r.marketValue || r.currentValue)}</strong> : '-' },
    { key: "irTax", title: "I.R.", render: (r: any) => {
        if (r.movementType !== 'DEPOSIT' || !r.taxes) return '-';
        return <span style={{color: '#EF4444', fontSize: 12}}>{priceBRL(r.taxes.irTax)} <br/><small>({(r.taxes.irRate*100).toFixed(1)}%)</small></span>;
    }},
    { key: "b3Tax", title: "Taxa B3", render: (r: any) => {
        if (r.movementType !== 'DEPOSIT' || !r.taxes) return '-';
        return <span style={{color: '#EF4444', fontSize: 12}}>{priceBRL(r.taxes.b3Tax)}</span>;
    }},
    { key: "netValue", title: "Valor Líquido", render: (r: any) => {
        if (r.movementType !== 'DEPOSIT' || !r.taxes) return '-';
        return <strong style={{color: '#10B981'}}>{priceBRL(r.taxes.netValue)}</strong>;
    }},
    { key: "actions", title: "", render: (r: any) => (
        <button onClick={() => handleDeleteMovement(r)} style={{background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 12}}>Apagar</button>
    )}
  ];

  // Gerar Snapshots Retroativos para contratos antigos que não têm snapshots reais no banco
  const generateRetroactiveSnapshots = (treasuries: any[], realSnapshots: any[]) => {
      const simulated: any[] = [];
      const today = new Date();
      
      treasuries.forEach(t => {
          const purchaseDate = new Date(t.purchaseDate);
          const rate = t.monthlyEstimatedRate || 0;
          let equity = t.investedAmount;
          let prevEquity = equity;
          
          let iterDate = new Date(purchaseDate.getFullYear(), purchaseDate.getMonth() + 1, 0); // Fim do mês de compra
          
          while (iterDate < today) {
              // Verifica se já existe snapshot real para este contrato neste mês
              const hasRealSnapshot = realSnapshots.some(s => 
                  s.treasuryId === t.id && 
                  new Date(s.snapshotDate).getMonth() === iterDate.getMonth() &&
                  new Date(s.snapshotDate).getFullYear() === iterDate.getFullYear()
              );
              
              // Se tiver snapshot real, não simula (a partir daqui o real assume)
              if (hasRealSnapshot) {
                  // Ajusta o equity para o valor real para continuar a simulação (se precisasse)
                  const real = realSnapshots.find(s => s.treasuryId === t.id && new Date(s.snapshotDate).getMonth() === iterDate.getMonth());
                  if(real) equity = real.currentValue;
              } else {
                  // Evolui 1 mês de juros
                  const appliedYield = equity * rate;
                  equity += appliedYield;
                  
                  simulated.push({
                      treasuryId: t.id,
                      snapshotDate: iterDate.toISOString(),
                      previousValue: prevEquity,
                      currentValue: equity,
                      appliedYield: appliedYield,
                      projectedValue: t.projectedValue || equity // simplificação
                  });
              }
              prevEquity = equity;
              iterDate = new Date(iterDate.getFullYear(), iterDate.getMonth() + 2, 0); // Próximo fim de mês
          }
      });
      return simulated;
  };

  const allSnapshotsCombined = [...groupSnapshots, ...generateRetroactiveSnapshots(groupTreasuries, groupSnapshots)];

  // Consolidar Snapshots que têm a mesma data em um único
  const groupedSnapshotsMap: any = {};
  allSnapshotsCombined.forEach(s => {
      const d = new Date(s.snapshotDate).toISOString().split('T')[0];
      const monthKey = `${new Date(s.snapshotDate).getFullYear()}-${new Date(s.snapshotDate).getMonth()}`;
      // Usar a chave mês/ano para não duplicar se o dia variar (ex: dia 28 vs dia 31)
      if (!groupedSnapshotsMap[monthKey]) {
          groupedSnapshotsMap[monthKey] = {
              snapshotDate: s.snapshotDate, // mantem a data base
              previousValue: 0,
              currentValue: 0,
              appliedYield: 0,
              projectedValue: 0
          };
      }
      groupedSnapshotsMap[monthKey].previousValue += s.previousValue;
      groupedSnapshotsMap[monthKey].currentValue += s.currentValue;
      groupedSnapshotsMap[monthKey].appliedYield += s.appliedYield;
      groupedSnapshotsMap[monthKey].projectedValue += (s.projectedValue || s.currentValue);
  });
  const consolidatedSnapshots = Object.values(groupedSnapshotsMap).sort((a: any, b: any) => new Date(a.snapshotDate).getTime() - new Date(b.snapshotDate).getTime());

  const snapshotColumns = [
    { key: "snapshotDate", title: "Data Mês", render: (r: any) => new Date(r.snapshotDate).toLocaleDateString('pt-BR') },
    { key: "previousValue", title: "Valor Ant. Agrupado", render: (r: any) => priceBRL(r.previousValue) },
    { key: "currentValue", title: "Valor Atual Agrupado", render: (r: any) => priceBRL(r.currentValue) },
    { key: "appliedYield", title: "Rend. Total do Mês", render: (r: any) => priceBRL(r.appliedYield) },
  ];

  // Chart Data Generators
  const generateHistoryData = () => {
    return consolidatedSnapshots.map((s: any) => {
        const d = new Date(s.snapshotDate);
        return {
            name: `${d.getMonth()+1}/${d.getFullYear()}`,
            "Valor Atual": s.currentValue,
            "Valor Projetado": s.projectedValue
        };
    });
  };

  const generateEvolutionData = () => {
   // Incluir as compras (investedAmount inicial) como DEPOSITOS artificiais se não estiverem em movements
   // Mas assumiremos que os movements contém tudo, ou que a tabela já tem o histórico.
   // Para simplicidade, usamos os movimentos reais.
   const sorted = [...groupMovements].sort((a,b) => new Date(a.movementDate).getTime() - new Date(b.movementDate).getTime());
   let accDeposit = 0;
   let accWithdraw = 0;
   const data: any[] = [];
   const grouped: any = {};

   sorted.forEach(m => {
       const d = new Date(m.movementDate);
       const key = `${d.getMonth()+1}/${d.getFullYear()}`;
       if(!grouped[key]) grouped[key] = { deposit: 0, withdraw: 0 };

       if (m.movementType === 'DEPOSIT') grouped[key].deposit += m.amount;
       if (m.movementType === 'WITHDRAW') grouped[key].withdraw += m.amount;
   });

   for (const key of Object.keys(grouped)) {
       accDeposit += grouped[key].deposit;
       accWithdraw += grouped[key].withdraw;
       data.push({
           name: key,
           "Aportes Acumulados": accDeposit,
           "Resgates Acumulados": accWithdraw,
           "Balanço Liquido Aplicado": accDeposit - accWithdraw
       });
   }
   return data;
  };

  const generateProjectionData = () => {
    // Calculamos a curva individualmente e somamos
    const dataMap: any = {};
    const MAX_MONTHS = 36; // Limitar projeção visual

    groupTreasuries.forEach(t => {
        let rate = t.monthlyEstimatedRate || 0;
        let equity = t.currentValue || 0;
        const start = new Date();
        const end = new Date(t.maturityDate);
        let months = (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
        if (months < 0) months = 0;
        months = Math.min(months, MAX_MONTHS);

        let d = new Date();
        for (let i = 0; i <= months; i++) {
            const key = `${d.getMonth()+1}/${d.getFullYear()}`;
            if (!dataMap[key]) dataMap[key] = { name: key, "Patrimônio Projetado": 0, sortDate: d.getTime() };

            dataMap[key]["Patrimônio Projetado"] += equity;

            // evoluir para o proximo mês
            equity = equity * (1 + rate);
            d.setMonth(d.getMonth() + 1);
        }
    });

    const data = Object.values(dataMap).sort((a: any, b: any) => a.sortDate - b.sortDate);
    return data;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 className={styles.title}>{decodedName}</h1>
            <p className={styles.subtitle}>Visão consolidada de {groupTreasuries.length} aportes/contratos agrupados</p>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <a 
              href="https://www.tesourodireto.com.br/titulos/precos-e-taxas.htm" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.submitBtn} 
              style={{ background: "#F59E0B", color: "#FFF", textDecoration: "none", margin: 0, width: "auto", padding: "8px 16px", display: "inline-block", textAlign: "center" }}
            >
              Consultar Preços na B3 ↗
            </a>
            <button onClick={handleUpdateMarketPrice} className={styles.submitBtn} style={{ background: "#5E17EB", margin: 0, width: "auto", padding: "8px 16px" }}>
                Sincronizar a Mercado (PU)
            </button>
            <button onClick={handleDeleteGroup} className={styles.deleteBtn}>Deletar Grupo</button>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <KpiCard
          icon="🏦"
          label="Valor Teórico (Curva)"
          value={priceBRL(currentValue)}
          subtitle="Taxa contratada mantida"
          variant="info"
        />
        <KpiCard
          icon="💰"
          label="Valor Real Bruto (Mercado)"
          value={priceBRL(marketValue)}
          subtitle="Antes dos impostos"
        />
        <KpiCard
          icon="🚀"
          label="Valor Líquido (Mercado)"
          value={priceBRL(netMarketValue)}
          subtitle={`Lucro líq. ${priceBRL(netGainMarket)}`}
          variant="success"
        />
        <KpiCard
          icon="📅"
          label="Vencimento"
          value={new Date(groupTreasuries[0].maturityDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
          subtitle="Data de expiração oficial"
          variant="warning"
        />
      </div>

      {/* Chart Section with Tabs */}
      <section className={styles.chartSection}>
        <div className={styles.tabsHeader}>
            <button
                className={`${styles.tabBtn} ${activeChartTab === 'HISTORICO' ? styles.activeTab : ''}`}
                onClick={() => setActiveChartTab('HISTORICO')}
            >
                Gráfico Histórico
            </button>
            <button
                className={`${styles.tabBtn} ${activeChartTab === 'EVOLUCAO' ? styles.activeTab : ''}`}
                onClick={() => setActiveChartTab('EVOLUCAO')}
            >
                Evolução (Aportes/Resgates)
            </button>
            <button
                className={`${styles.tabBtn} ${activeChartTab === 'PROJECAO' ? styles.activeTab : ''}`}
                onClick={() => setActiveChartTab('PROJECAO')}
            >
                Projeção Futura
            </button>
        </div>

        <div className={styles.tabContent}>
            {activeChartTab === 'HISTORICO' && (
                <DashboardChart title="Histórico Consolidado" subtitle="Valor atual vs Projetado no tempo">
                    {consolidatedSnapshots.length === 0 ? (
                        <div className={styles.emptyChart}>Sem dados de histórico suficientes.</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={generateHistoryData()}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tickFormatter={(val) => `R$ ${val}`} tick={{ fontSize: 12 }} width={80} />
                                <RechartsTooltip formatter={(val: number) => priceBRL(val)} />
                                <Legend />
                                <Area type="monotone" dataKey="Valor Atual" stroke="#5E17EB" fill="#5E17EB" fillOpacity={0.2} />
                                <Area type="monotone" dataKey="Valor Projetado" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </DashboardChart>
            )}

            {activeChartTab === 'EVOLUCAO' && (
                <DashboardChart title="Evolução de Movimentações" subtitle="Aportes e Resgates acumulados">
                    {groupMovements.length === 0 ? (
                        <div className={styles.emptyChart}>Nenhuma movimentação para exibir evolução.</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={generateEvolutionData()}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tickFormatter={(val) => `R$ ${val}`} tick={{ fontSize: 12 }} width={80} />
                                <RechartsTooltip formatter={(val: number) => priceBRL(val)} />
                                <Legend />
                                <Bar dataKey="Aportes Acumulados" fill="#5E17EB" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Resgates Acumulados" fill="#EF4444" radius={[4, 4, 0, 0]} />
                                <Line type="monotone" dataKey="Balanço Liquido Aplicado" stroke="#F59E0B" strokeWidth={2} />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </DashboardChart>
            )}

            {activeChartTab === 'PROJECAO' && (
                <DashboardChart title="Projeção Consolidada" subtitle="Curva calculada somando todos os seus contratos individuais">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={generateProjectionData()}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tickFormatter={(val) => `R$ ${val}`} tick={{ fontSize: 12 }} width={80} />
                            <RechartsTooltip formatter={(val: number) => priceBRL(val)} />
                            <Legend />
                            <Line type="monotone" dataKey="Patrimônio Projetado" stroke="#10B981" strokeWidth={3} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </DashboardChart>
            )}
        </div>
      </section>

      <div className={styles.twoCol}>
        {/* Nova Movimentação Form */}
        <section className={styles.formSection}>
          <h3>Registrar Movimentação</h3>
          <p style={{fontSize: 12, color: '#64748B', marginBottom: 16}}>Aportes criam um novo contrato. Resgates abatem do contrato mais antigo.</p>
          <form onSubmit={handleCreateMovement} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Tipo</label>
              <select value={movementType} onChange={e => setMovementType(e.target.value)}>
                <option value="DEPOSIT">Novo Aporte</option>
                <option value="WITHDRAW">Resgate</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Valor (R$)</label>
              <input type="text" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0,00" />
            </div>
            <div className={styles.formGroup}>
              <label>Data</label>
              <input type="date" value={movementDate} onChange={e => setMovementDate(e.target.value)} />
            </div>

            {movementType === 'DEPOSIT' && (
                <>
                {groupTreasuries[0]?.treasuryType.includes('IPCA') || groupTreasuries[0]?.treasuryType.includes('SELIC') ? (
                  <>
                    <div className={styles.formGroup}>
                        <label>Taxa Fixa do Título (%)</label>
                        <input type="text" value={fixedRate} onChange={e => setFixedRate(e.target.value)} placeholder="Ex: 0,11" required />
                    </div>
                    <div className={styles.formGroup}>
                        <label title="Taxa ou Projeção do Indexador">
                          {groupTreasuries[0]?.treasuryType.includes('IPCA') ? "Projeção IPCA Anual (%) ℹ️" : "Taxa Selic Anual (%) ℹ️"}
                        </label>
                        <input type="text" value={groupTreasuries[0]?.treasuryType.includes('IPCA') ? ipcaRate : selicRate} onChange={e => groupTreasuries[0]?.treasuryType.includes('IPCA') ? setIpcaRate(e.target.value) : setSelicRate(e.target.value)} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Taxa Total Projetada</label>
                        <div style={{ padding: '8px', background: '#F3F4F6', borderRadius: '4px', fontWeight: 'bold', color: '#1F2937' }}>
                            {groupTreasuries[0]?.treasuryType.includes('IPCA') 
                              ? ((parseBrNumber(fixedRate)||0) + (parseBrNumber(ipcaRate)||0)).toFixed(2)
                              : ((parseBrNumber(fixedRate)||0) + (parseBrNumber(selicRate)||0)).toFixed(2)}% a.a.
                        </div>
                    </div>
                  </>
                ) : (
                  <div className={styles.formGroup}>
                      <label>Taxa Anual Contratada (%)</label>
                      <input type="text" value={annualRate} onChange={e => setAnnualRate(e.target.value)} placeholder="Ex: 14,87" required />
                  </div>
                )}
                <div className={styles.formGroup}>
                    <label>Quantidade de Títulos (Opcional)</label>
                    <input type="text" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Ex: 1,80" />
                </div>
                <div className={styles.formGroup}>
                    <label>Preço Unitário (Opcional)</label>
                    <input type="text" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} placeholder="Ex: 3.871,35" />
                </div>
                </>
            )}

            <div className={styles.formGroup}>
              <label>Descrição</label>
              <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Ex: Aporte mensal" />
            </div>
            <button type="submit" className={styles.submitBtn}>Salvar Movimentação</button>
          </form>
        </section>

        {/* Movimentações Table */}
        <section className={styles.tableSection}>
          <h3>Histórico Global de Movimentações</h3>
          <Table data={groupMovements} columns={movementColumns} emptyMessage="Nenhuma movimentação registrada neste grupo." itemsPerPage={5} />
        </section>
      </div>

      {/* Snapshots */}
      <section className={styles.tableSection} style={{ marginTop: "24px" }}>
        <h3>Evolução Mensal (Snapshots Consolidados)</h3>
        <Table data={consolidatedSnapshots} columns={snapshotColumns} emptyMessage="O sistema ainda não tirou snapshots deste grupo." itemsPerPage={5} />
      </section>
    </div>
  );
}
