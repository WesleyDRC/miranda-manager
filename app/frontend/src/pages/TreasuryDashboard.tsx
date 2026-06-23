import React, { useEffect, useState } from "react";
import axiosRepositoryInstance from "../repository/AxiosRepository";
import styles from "./TreasuryDashboard.module.css";
import priceBRL from "../utils/formatPrice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { KpiCard } from "../components/dashboard/components/KpiCard";
import { LiveMarketRates } from "../components/dashboard/components/LiveMarketRates";
import { Table } from "../components/ui/Table";

export function TreasuryDashboard() {
  const navigate = useNavigate();
  const [treasuries, setTreasuries] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [selectedProduct, setSelectedProduct] = useState("");
  const [customTitleName, setCustomTitleName] = useState("");

  const [treasuryType, setTreasuryType] = useState("SELIC");
  const [titleName, setTitleName] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [maturityDate, setMaturityDate] = useState("");
  const [investedAmount, setInvestedAmount] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [fixedRate, setFixedRate] = useState("");
  const [ipcaRate, setIpcaRate] = useState("4.50");
  const [selicRate, setSelicRate] = useState("10.50");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [liquidityAvailable, setLiquidityAvailable] = useState(true);
  const [monthlyEstimatedRate, setMonthlyEstimatedRate] = useState("");

  const fetchData = async () => {
    try {
      const [tRes, pRes] = await Promise.all([
        axiosRepositoryInstance.getTreasuries(),
        axiosRepositoryInstance.getTreasuryProducts()
      ]);
      console.log(tRes)
      console.log(pRes)
      setTreasuries(tRes.data.investments || []);
      setProducts(pRes.data.products || []);
    } catch (err) {
      toast.error("Erro ao carregar dados do Tesouro Direto.");
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
  }, []);

  // Handle Product Selection
  useEffect(() => {
    if (selectedProduct && selectedProduct !== "OUTRO") {
      const prod = products.find(p => p.name === selectedProduct);
      if (prod) {
        setTitleName(prod.name);
        setTreasuryType(prod.treasuryType);
        // Format date for HTML input (YYYY-MM-DD)
        if (prod.maturityDate) {
          const d = new Date(prod.maturityDate);
          setMaturityDate(d.toISOString().split('T')[0]);
        }
      }
    } else if (selectedProduct === "OUTRO") {
      setTitleName(customTitleName);
    }
  }, [selectedProduct, customTitleName, products]);

  const parseBrNumber = (val: string) => {
    if (!val) return undefined;
    let str = val.toString().trim();
    if (str.includes(',')) {
        str = str.replace(/\./g, "").replace(",", ".");
    }
    return Number(str);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleName || !investedAmount || !purchaseDate || !maturityDate) {
      toast.warning("Preencha todos os campos obrigatórios.");
      return;
    }

    const parsedInvestedAmount = parseBrNumber(investedAmount) || 0;
    const parsedAnnualRate = parseBrNumber(annualRate) || 0;
    const parsedFixedRate = parseBrNumber(fixedRate) || 0;
    const parsedIpcaRate = parseBrNumber(ipcaRate) || 0;
    const parsedSelicRate = parseBrNumber(selicRate) || 0;
    const parsedQuantity = parseBrNumber(quantity);
    const parsedUnitPrice = parseBrNumber(unitPrice);

    try {
      const isIPCA = treasuryType.includes('IPCA');
      const isSelic = treasuryType.includes('SELIC');
      
      let finalAnnualRate = parsedAnnualRate;
      if (isIPCA) finalAnnualRate = parsedFixedRate + parsedIpcaRate;
      else if (isSelic) finalAnnualRate = parsedFixedRate + parsedSelicRate;

      await axiosRepositoryInstance.createTreasury({
        treasuryType,
        titleName,
        purchaseDate: new Date(purchaseDate).toISOString(),
        maturityDate: new Date(maturityDate).toISOString(),
        investedAmount: parsedInvestedAmount,
        annualRate: finalAnnualRate,
        liquidityAvailable,
        quantity: parsedQuantity,
        unitPrice: parsedUnitPrice,
        notes: ""
      });

      toast.success("Título do Tesouro cadastrado com sucesso!");
      setInvestedAmount("");
      setAnnualRate("");
      setFixedRate("");
      fetchIpcaFocus();
      setQuantity("");
      setUnitPrice("");
      setLiquidityAvailable(true);
      fetchData();
    } catch (err) {
      toast.error("Erro ao cadastrar título.");
    }
  };

  const totalCurrentValue = treasuries.reduce((acc, t) => acc + (t.currentValue || 0), 0);
  const totalMarketValue = treasuries.reduce((acc, t) => acc + (t.marketValue || t.currentValue || 0), 0);
  const totalProjectedValue = treasuries.reduce((acc, t) => acc + (t.projectedValue || t.currentValue || 0), 0);
  
  const totalNetValue = treasuries.reduce((acc, t) => {
    return acc + (t.taxes?.netValue || t.marketValue || t.currentValue || 0);
  }, 0);

  const totalYieldMarket = totalMarketValue - treasuries.reduce((acc, t) => acc + t.investedAmount, 0);
  const totalYieldNet = totalNetValue - treasuries.reduce((acc, t) => acc + t.investedAmount, 0);
  const growthPercentage = totalCurrentValue > 0 ? (totalYieldNet / totalCurrentValue) * 100 : 0;

  // Group treasuries by name for the UI Table
  const groupedTreasuries = Object.values(treasuries.reduce((acc: any, t: any) => {
    if (!acc[t.titleName]) {
      acc[t.titleName] = { ...t, itemCount: 1 };
    } else {
      acc[t.titleName].currentValue = (acc[t.titleName].currentValue || 0) + (t.currentValue || 0);
      acc[t.titleName].marketValue = (acc[t.titleName].marketValue || 0) + (t.marketValue || t.currentValue || 0);
      acc[t.titleName].projectedValue = (acc[t.titleName].projectedValue || 0) + (t.projectedValue || t.currentValue || 0);
      acc[t.titleName].itemCount += 1;
    }
    return acc;
  }, {}));

  const tableColumns = [
    { key: "titleName", title: "Nome do Título", render: (r: any) => <div><strong>{r.titleName}</strong> <span style={{fontSize: 12, color: '#64748B'}}>({r.itemCount} aportes)</span></div> },
    { key: "treasuryType", title: "Tipo", render: (r: any) => r.treasuryType.replace("_", " ") },
    { key: "currentValue", title: "Patrimônio (Curva)", render: (r: any) => priceBRL(r.currentValue || 0) },
    { key: "marketValue", title: "Patrimônio (Mercado Bruto)", render: (r: any) => priceBRL(r.marketValue || r.currentValue || 0) },
    { key: "maturityDate", title: "Vencimento Principal", render: (r: any) => new Date(r.maturityDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) },
    {
      key: "actions",
      title: "Ações",
      render: (r: any) => (
        <button
          onClick={() => navigate(`/investments/treasury/${encodeURIComponent(r.titleName)}`)}
          className={styles.detailsBtn}
        >
          Ver Detalhes
        </button>
      )
    }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '20px' }}>
          <div>
            <h1 className={styles.title}>Tesouro Direto</h1>
            <p className={styles.subtitle}>Gerencie seus investimentos em títulos públicos e acompanhe as rentabilidades agrupadas.</p>
          </div>
          <LiveMarketRates />
        </div>
      </header>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <KpiCard
          icon="🏦"
          label="Patrimônio Total (Curva)"
          value={priceBRL(totalCurrentValue)}
          subtitle="Valor teórico somado"
          variant="info"
        />
        <KpiCard
          icon="💰"
          label="Patrimônio (Mercado Bruto)"
          value={priceBRL(totalMarketValue)}
          subtitle="Antes dos impostos"
        />
        <KpiCard
          icon="🚀"
          label="Patrimônio (Mercado Líq.)"
          value={priceBRL(totalNetValue)}
          subtitle="Se todos fossem vendidos hoje"
          variant="success"
        />
        <KpiCard
          icon="📊"
          label="Lucro Líquido Real"
          value={priceBRL(totalYieldNet)}
          subtitle={`${growthPercentage.toFixed(2)}% líquido sobre curva`}
        />
      </div>

      {/* Form */}
      <section className={styles.formSection}>
        <h3>Adicionar Novo Aporte ou Título</h3>
        <form onSubmit={handleCreate} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Nome do Título Oficial</label>
              <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
                <option value="">-- Selecione o Título --</option>
                {products.map(p => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
                <option value="OUTRO">Outro (Digitar manualmente)</option>
              </select>
            </div>

            {selectedProduct === "OUTRO" && (
              <div className={styles.formGroup}>
                <label>Nome Personalizado</label>
                <input type="text" value={customTitleName} onChange={e => { setCustomTitleName(e.target.value); setTitleName(e.target.value); }} placeholder="Nome exato do título" />
              </div>
            )}

            <div className={styles.formGroup}>
              <label>Tipo</label>
              <select value={treasuryType} onChange={e => setTreasuryType(e.target.value)} disabled={selectedProduct !== "OUTRO" && selectedProduct !== ""}>
                <option value="SELIC">Tesouro Selic</option>
                <option value="PREFIXADO">Tesouro Prefixado</option>
                <option value="PREFIXADO_JUROS">Prefixado com Juros Semestrais</option>
                <option value="IPCA">Tesouro IPCA+</option>
                <option value="IPCA_JUROS">IPCA+ com Juros Semestrais</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label title="A data final de resgate automático estipulada pelo governo.">Vencimento ℹ️</label>
              <input type="date" value={maturityDate} onChange={e => setMaturityDate(e.target.value)} disabled={selectedProduct !== "OUTRO" && selectedProduct !== ""} />
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Data do Aporte</label>
              <input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label>Valor Investido (R$)</label>
              <input type="text" value={investedAmount} onChange={e => setInvestedAmount(e.target.value)} required />
            </div>
            {treasuryType.includes('IPCA') || treasuryType.includes('SELIC') ? (
              <>
                <div className={styles.formGroup}>
                  <label>Taxa Fixa do Título (%)</label>
                  <input type="text" value={fixedRate} onChange={e => setFixedRate(e.target.value)} placeholder="Ex: 0,11" required />
                </div>
                <div className={styles.formGroup}>
                  <label title="Taxa ou Projeção do Indexador do título.">
                    {treasuryType.includes('IPCA') ? "Projeção IPCA Anual (%) ℹ️" : "Taxa Selic Anual (%) ℹ️"}
                  </label>
                  <input type="text" value={treasuryType.includes('IPCA') ? ipcaRate : selicRate} onChange={e => treasuryType.includes('IPCA') ? setIpcaRate(e.target.value) : setSelicRate(e.target.value)} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Taxa Total Projetada</label>
                  <div style={{ padding: '8px', background: '#F3F4F6', borderRadius: '4px', fontWeight: 'bold', color: '#1F2937' }}>
                    {treasuryType.includes('IPCA') 
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
          </div>

          <div className={styles.checkboxGroup}>
            <input type="checkbox" id="liquidity" checked={liquidityAvailable} onChange={e => setLiquidityAvailable(e.target.checked)} />
            <label htmlFor="liquidity" title="Se marcado, a engine de projeção usará este título para cobrir saldo negativo automático na conta principal.">
              Liquidez Diária (Permite uso emergencial) ℹ️
            </label>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Cadastrar Aporte
          </button>
        </form>
      </section>

      {/* List */}
      <section className={styles.tableSection}>
        <h3>Meus Títulos Consolidados</h3>
        {loading ? (
          <div>Carregando...</div>
        ) : (
          <Table data={groupedTreasuries} columns={tableColumns} emptyMessage="Nenhum título do tesouro encontrado." itemsPerPage={10} />
        )}
      </section>
    </div>
  );
}
