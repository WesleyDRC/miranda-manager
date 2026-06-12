import { useEffect, useState } from "react";
import axiosRepositoryInstance from "../repository/AxiosRepository";
import styles from "./ForecastDashboard.module.css"; // Reusing styles for aesthetics
import priceBRL from "../utils/formatPrice";
import { toast } from "react-toastify";

export function WalletsDashboard() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");

  const fetchWallets = async () => {
    try {
      const response = await axiosRepositoryInstance.getWallets();
      setWallets(response.data.wallets || []);
    } catch (err) {
      toast.error("Erro ao carregar carteiras.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name || !balance) {
      toast.warning("Preencha todos os campos.");
      return;
    }

    try {
      await axiosRepositoryInstance.createWallet({
        name,
        balance: Number(balance)
      });
      toast.success("Carteira criada com sucesso!");
      setName("");
      setBalance("");
      fetchWallets();
    } catch (err) {
      toast.error("Erro ao criar carteira.");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Minhas Contas (Wallets)</h1>
        <p className={styles.subtitle}>Gerencie o saldo atual do seu dinheiro.</p>
      </header>

      {/* Form */}
      <section className={styles.chartSection} style={{ marginBottom: "24px" }}>
        <h3>Nova Conta</h3>
        <form onSubmit={handleCreate} style={{ display: "flex", gap: "16px", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
            <label style={{ fontSize: "14px", fontWeight: 600, color: "#1E293B" }}>Nome da Conta</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Ex: Nubank, Banco do Brasil..." 
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
            <label style={{ fontSize: "14px", fontWeight: 600, color: "#1E293B" }}>Saldo Atual (R$)</label>
            <input 
              type="number" 
              step="0.01"
              value={balance} 
              onChange={(e) => setBalance(e.target.value)} 
              placeholder="0.00" 
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0" }}
            />
          </div>
          <button type="submit" style={{ padding: "12px 24px", borderRadius: "8px", background: "#5E17EB", color: "white", border: "none", fontWeight: 600, cursor: "pointer", height: "42px" }}>
            Adicionar
          </button>
        </form>
      </section>

      {/* List */}
      <div className={styles.kpiGrid}>
        {loading ? (
          <div className={styles.loading}>Carregando...</div>
        ) : wallets.length === 0 ? (
          <div style={{ color: "#64748B" }}>Nenhuma conta cadastrada.</div>
        ) : (
          wallets.map(wallet => (
            <div key={wallet.id} className={styles.kpiCard} style={{ borderLeftColor: "#10B981" }}>
              <span className={styles.kpiLabel}>{wallet.name}</span>
              <span className={styles.kpiValue}>{priceBRL(wallet.balance)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
