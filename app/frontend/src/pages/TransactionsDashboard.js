import { useEffect, useState } from "react";
import axiosRepositoryInstance from "../repository/AxiosRepository";
import styles from "./ForecastDashboard.module.css";
import priceBRL from "../utils/formatPrice";
import { toast } from "react-toastify";

export function TransactionsDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [type, setType] = useState("INCOME");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [dueDateDay, setDueDateDay] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchTransactions = async () => {
    try {
      const response = await axiosRepositoryInstance.getTransactions();
      setTransactions(response.data.transactions || []);
    } catch (err) {
      toast.error("Erro ao carregar receitas e despesas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!amount || !description || !dueDateDay) {
      toast.warning("Preencha todos os campos.");
      return;
    }

    try {
      // Ajusta data fictícia para o dia selecionado (já que é recorrente, usamos a data atual como base)
      const now = new Date();
      now.setDate(Number(dueDateDay));

      await axiosRepositoryInstance.createTransaction({
        type,
        amount: Number(amount),
        dueDate: now,
        isPaid: false,
        isRecurring: true, // Aqui assumimos tudo recorrente (salário/contas fixas)
        source: "MANUAL",
        description,
        endDate: endDate ? new Date(endDate) : undefined,
        userId: "will-be-injected" // The backend injects based on token
      });

      toast.success("Adicionado com sucesso!");
      setAmount("");
      setDescription("");
      setDueDateDay("");
      setEndDate("");
      fetchTransactions();
    } catch (err) {
      toast.error("Erro ao adicionar.");
    }
  };

  const handleDelete = async (id, deleteHistory) => {
    try {
      await axiosRepositoryInstance.deleteTransaction(id, deleteHistory);
      toast.success("Regra removida com sucesso!");
      setDeleteModalTxId(null);
      fetchTransactions();
    } catch (err) {
      toast.error("Erro ao remover.");
    }
  };

  const allIncomes = transactions.filter(t => t.type === "INCOME" && t.isRecurring);
  const allExpenses = transactions.filter(t => t.type === "EXPENSE" && t.isRecurring && !t.patrimonyId);

  const groupRules = (allTxs) => {
    const rulesMap = new Map();
    allTxs.forEach(t => {
      if (!rulesMap.has(t.recurrenceRuleId)) {
        rulesMap.set(t.recurrenceRuleId, { baseTx: t, hasFutureUnpaid: false, maxDueDate: t.dueDate });
      }
      
      const data = rulesMap.get(t.recurrenceRuleId);
      if (new Date(t.dueDate) > new Date(data.maxDueDate)) {
        data.maxDueDate = t.dueDate;
      }

      // Check if there is any future unpaid transaction
      if (!t.isPaid && new Date(t.dueDate) >= new Date(new Date().setHours(0,0,0,0))) {
        data.hasFutureUnpaid = true;
      }
    });

    const active = [];
    const deactivated = [];
    rulesMap.forEach((data) => {
      data.baseTx._computedEndDate = data.maxDueDate;
      if (data.hasFutureUnpaid) {
        active.push(data.baseTx);
      } else {
        deactivated.push(data.baseTx);
      }
    });

    return { active, deactivated };
  };

  const { active: incomes, deactivated: deactivatedIncomes } = groupRules(allIncomes);
  const { active: expenses, deactivated: deactivatedExpenses } = groupRules(allExpenses);

  const [activeTab, setActiveTab] = useState("RULES");
  const [editingTx, setEditingTx] = useState(null);
  const [editingRule, setEditingRule] = useState(null);
  const [deleteModalTxId, setDeleteModalTxId] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [showAdvancedDelete, setShowAdvancedDelete] = useState(false);
  const [mockUpload, setMockUpload] = useState("");
  const [statementDate, setStatementDate] = useState(new Date());

  const handlePrevMonth = () => {
    setStatementDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setStatementDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    toast.success("MOCK: Salário do mês atualizado e Holerite salvo!");
    setEditingTx(null);
    setMockUpload("");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Fluxo de Caixa Mensal</h1>
        <p className={styles.subtitle}>Gerencie suas Regras Base e altere meses específicos (Ex: Horas Extras).</p>
      </header>

      {/* TABS */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px", borderBottom: "2px solid #E2E8F0" }}>
        <button 
          onClick={() => setActiveTab("RULES")}
          style={{ padding: "12px 24px", background: "none", border: "none", borderBottom: activeTab === "RULES" ? "2px solid #5E17EB" : "none", color: activeTab === "RULES" ? "#5E17EB" : "#64748B", fontWeight: "bold", cursor: "pointer", marginBottom: "-2px" }}>
          Regras Base
        </button>
        <button 
          onClick={() => setActiveTab("MONTHLY")}
          style={{ padding: "12px 24px", background: "none", border: "none", borderBottom: activeTab === "MONTHLY" ? "2px solid #5E17EB" : "none", color: activeTab === "MONTHLY" ? "#5E17EB" : "#64748B", fontWeight: "bold", cursor: "pointer", marginBottom: "-2px" }}>
          Extrato
        </button>
      </div>

      {activeTab === "RULES" && (
        <>
          <section className={styles.chartSection} style={{ marginBottom: "24px" }}>
            <h3>Novo Lançamento Fixo/Mensal</h3>
            <form onSubmit={handleCreate} style={{ display: "flex", gap: "16px", alignItems: "flex-end", flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                <label style={{ fontSize: "14px", fontWeight: 600 }}>Tipo</label>
                <select value={type} onChange={(e) => setType(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                  <option value="INCOME">Entrada (Ex: Salário)</option>
                  <option value="EXPENSE">Saída (Ex: Luz, Mercado)</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 2 }}>
                <label style={{ fontSize: "14px", fontWeight: 600 }}>Descrição</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Salário da Empresa X" style={{ padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                <label style={{ fontSize: "14px", fontWeight: 600 }}>Valor (R$)</label>
                <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" style={{ padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                <label style={{ fontSize: "14px", fontWeight: 600 }}>Dia de Vencimento</label>
                <input type="number" min="1" max="31" value={dueDateDay} onChange={(e) => setDueDateDay(e.target.value)} placeholder="Dia" style={{ padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                <label style={{ fontSize: "14px", fontWeight: 600 }}>Até (Opcional)</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0" }} />
              </div>
              <button type="submit" style={{ padding: "12px 24px", borderRadius: "8px", background: "#5E17EB", color: "white", border: "none", fontWeight: 600, cursor: "pointer", height: "42px" }}>
                Adicionar
              </button>
            </form>
          </section>

          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            <section className={styles.chartSection} style={{ flex: 1, minWidth: "300px" }}>
              <h3 style={{ color: "#10B981" }}>Minhas Regras de Receita</h3>
              {loading ? <div>Carregando...</div> : incomes.length === 0 ? <div style={{ color: "#64748B" }}>Sem receitas.</div> : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {incomes.slice(0,5).map((tx, idx) => (
                    <div key={idx} style={{ padding: "12px", background: "#F8FAFC", borderRadius: "8px", borderLeft: "4px solid #10B981" }}>
                      {editingRule === tx.id ? (
                        <form onSubmit={async (e) => {
                          e.preventDefault();
                          try {
                            const newAmount = e.target.ruleAmount.value;
                            const newEndDate = e.target.ruleEndDate.value;
                            const updatePayload = {
                              amount: Number(newAmount),
                              updateRule: true
                            };
                            if (newEndDate) {
                              updatePayload.endDate = new Date(newEndDate);
                            }
                            await axiosRepositoryInstance.updateTransaction(tx.id, updatePayload);
                            toast.success("Regra base atualizada! Projeções futuras foram recalculadas.");
                            setEditingRule(null);
                            fetchTransactions();
                          } catch (err) {
                            toast.error("Erro ao atualizar regra");
                          }
                        }} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <input name="ruleAmount" type="number" step="0.01" defaultValue={tx.amount} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #E2E8F0", width: "100px" }} />
                          <input name="ruleEndDate" type="date" defaultValue={tx.ruleEndDate ? new Date(tx.ruleEndDate).toISOString().split('T')[0] : ""} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #E2E8F0", width: "130px" }} />
                          <button type="submit" style={{ padding: "8px 12px", background: "#10B981", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Salvar</button>
                          <button type="button" onClick={() => setEditingRule(null)} style={{ padding: "8px 12px", background: "transparent", border: "1px solid #CBD5E1", borderRadius: "4px", cursor: "pointer" }}>Cancelar</button>
                        </form>
                      ) : (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <div>
                            <div style={{ fontWeight: "bold" }}>{tx.description}</div>
                            <div style={{ fontSize: "12px", color: "#64748B" }}>Regra: Dia {new Date(tx.dueDate).getDate()}</div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ fontWeight: "bold", color: "#10B981" }}>{priceBRL(tx.amount)}</div>
                            <button onClick={() => setEditingRule(tx.id)} style={{ background: "transparent", border: "1px solid #10B981", color: "#10B981", borderRadius: "4px", padding: "4px 8px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>Editar</button>
                            <button onClick={() => setDeleteModalTxId(tx.id)} style={{ background: "transparent", border: "1px solid #EF4444", borderRadius: "4px", padding: "4px 8px", cursor: "pointer", color: "#EF4444", fontWeight: "bold", fontSize: "12px" }}>Encerrar</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className={styles.chartSection} style={{ flex: 1, minWidth: "300px" }}>
              <h3 style={{ color: "#EF4444" }}>Minhas Regras de Despesa</h3>
              {loading ? <div>Carregando...</div> : expenses.length === 0 ? <div style={{ color: "#64748B" }}>Sem despesas.</div> : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {expenses.slice(0,5).map((tx, idx) => (
                    <div key={idx} style={{ padding: "12px", background: "#F8FAFC", borderRadius: "8px", borderLeft: "4px solid #EF4444" }}>
                      {editingRule === tx.id ? (
                        <form onSubmit={async (e) => {
                          e.preventDefault();
                          try {
                            const newAmount = e.target.ruleAmount.value;
                            const newEndDate = e.target.ruleEndDate.value;
                            const updatePayload = {
                              amount: Number(newAmount),
                              updateRule: true
                            };
                            if (newEndDate) {
                              updatePayload.endDate = new Date(newEndDate);
                            }
                            await axiosRepositoryInstance.updateTransaction(tx.id, updatePayload);
                            toast.success("Regra base atualizada! Projeções futuras foram recalculadas.");
                            setEditingRule(null);
                            fetchTransactions();
                          } catch (err) {
                            toast.error("Erro ao atualizar regra");
                          }
                        }} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <input name="ruleAmount" type="number" step="0.01" defaultValue={tx.amount} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #E2E8F0", width: "100px" }} />
                          <input name="ruleEndDate" type="date" defaultValue={tx.ruleEndDate ? new Date(tx.ruleEndDate).toISOString().split('T')[0] : ""} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #E2E8F0", width: "130px" }} />
                          <button type="submit" style={{ padding: "8px 12px", background: "#EF4444", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>Salvar</button>
                          <button type="button" onClick={() => setEditingRule(null)} style={{ padding: "8px 12px", background: "transparent", border: "1px solid #CBD5E1", borderRadius: "4px", cursor: "pointer" }}>Cancelar</button>
                        </form>
                      ) : (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <div>
                            <div style={{ fontWeight: "bold" }}>{tx.description}</div>
                            <div style={{ fontSize: "12px", color: "#64748B" }}>Regra: Dia {new Date(tx.dueDate).getDate()}</div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ fontWeight: "bold", color: "#EF4444" }}>{priceBRL(tx.amount)}</div>
                            <button onClick={() => setEditingRule(tx.id)} style={{ background: "transparent", border: "1px solid #EF4444", color: "#EF4444", borderRadius: "4px", padding: "4px 8px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>Editar</button>
                            <button onClick={() => setDeleteModalTxId(tx.id)} style={{ background: "transparent", border: "1px solid #EF4444", borderRadius: "4px", padding: "4px 8px", cursor: "pointer", color: "#EF4444", fontWeight: "bold", fontSize: "12px" }}>Encerrar</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {(deactivatedIncomes.length > 0 || deactivatedExpenses.length > 0) && (
            <div style={{ marginTop: "40px" }}>
              <h3 style={{ color: "#64748B", borderBottom: "2px solid #E2E8F0", paddingBottom: "8px" }}>Histórico de Regras Encerradas</h3>
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginTop: "16px" }}>
                
                {deactivatedIncomes.length > 0 && (
                  <section style={{ flex: 1, minWidth: "300px", opacity: 0.7 }}>
                    <h4 style={{ color: "#64748B" }}>Receitas Antigas</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {deactivatedIncomes.map((tx, idx) => (
                        <div key={idx} style={{ padding: "12px", background: "#F1F5F9", borderRadius: "8px", borderLeft: "4px solid #94A3B8" }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                              <div style={{ fontWeight: "bold", color: "#475569", textDecoration: "line-through" }}>{tx.description}</div>
                              <div style={{ fontSize: "12px", color: "#64748B" }}>Encerrada</div>
                            </div>
                            <div style={{ fontWeight: "bold", color: "#94A3B8" }}>{priceBRL(tx.amount)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {deactivatedExpenses.length > 0 && (
                  <section style={{ flex: 1, minWidth: "300px", opacity: 0.7 }}>
                    <h4 style={{ color: "#64748B" }}>Despesas Antigas</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {deactivatedExpenses.map((tx, idx) => (
                        <div key={idx} style={{ padding: "12px", background: "#F1F5F9", borderRadius: "8px", borderLeft: "4px solid #94A3B8" }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                              <div style={{ fontWeight: "bold", color: "#475569", textDecoration: "line-through" }}>{tx.description}</div>
                              <div style={{ fontSize: "12px", color: "#64748B" }}>Encerrada</div>
                            </div>
                            <div style={{ fontWeight: "bold", color: "#94A3B8" }}>{priceBRL(tx.amount)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

              </div>
            </div>
          )}
        </>
      )}

      {activeTab === "MONTHLY" && (
        <section className={styles.chartSection}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h3>Extrato Mensal</h3>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", background: "#F1F5F9", padding: "8px 16px", borderRadius: "8px" }}>
              <button onClick={handlePrevMonth} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}>&lt;</button>
              <input 
                type="month" 
                value={`${statementDate.getFullYear()}-${String(statementDate.getMonth() + 1).padStart(2, '0')}`}
                onChange={(e) => {
                  if (e.target.value) {
                    const [y, m] = e.target.value.split("-");
                    setStatementDate(new Date(y, m - 1, 1));
                  }
                }}
                style={{ background: "none", border: "none", fontWeight: "bold", fontSize: "16px", outline: "none", fontFamily: "inherit" }}
              />
              <button onClick={handleNextMonth} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}>&gt;</button>
            </div>
          </div>

          {editingTx ? (
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const amount = e.target.amount.value;
                await axiosRepositoryInstance.updateTransaction(editingTx.id, {
                  amount: Number(amount)
                });
                toast.success("Lançamento atualizado para este mês!");
                setEditingTx(null);
                setMockUpload("");
                fetchTransactions();
              } catch (err) {
                toast.error("Erro ao atualizar transação");
              }
            }} style={{ background: "#F8FAFC", padding: "24px", borderRadius: "12px", border: "1px solid #E2E8F0", marginBottom: "24px" }}>
              <h4>Editando Lançamento: {editingTx.description}</h4>
              <div style={{ display: "flex", gap: "16px", marginTop: "16px", flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "14px", fontWeight: 600 }}>Valor Físico (R$)</label>
                  <input name="amount" type="number" step="0.01" defaultValue={editingTx.amount} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0", marginTop: "8px" }} />
                  <span style={{ fontSize: "12px", color: "#64748B" }}>Altere o valor especificamente para este mês.</span>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "14px", fontWeight: 600 }}>Anexar Comprovante (Opcional)</label>
                  <input type="file" accept=".pdf,image/png,image/jpeg" onChange={(e) => setMockUpload(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E2E8F0", marginTop: "8px", background: "white" }} />
                </div>
              </div>
              <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
                <button type="submit" style={{ padding: "10px 24px", background: "#10B981", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>Salvar Alteração Mês</button>
                <button type="button" onClick={() => setEditingTx(null)} style={{ padding: "10px 24px", background: "transparent", border: "1px solid #CBD5E1", borderRadius: "8px", cursor: "pointer" }}>Cancelar</button>
              </div>
            </form>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {(() => {
                const statementTransactions = transactions.filter(t => {
                  const d = new Date(t.dueDate);
                  return d.getMonth() === statementDate.getMonth() && d.getFullYear() === statementDate.getFullYear();
                }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

                const statementIncomes = statementTransactions.filter(t => t.type === "INCOME");
                const statementExpenses = statementTransactions.filter(t => t.type === "EXPENSE");
                const totalIncomes = statementIncomes.reduce((acc, t) => acc + t.amount, 0);
                const totalExpenses = statementExpenses.reduce((acc, t) => acc + t.amount, 0);
                const saldo = totalIncomes - totalExpenses;

                if (statementTransactions.length === 0) {
                  return <div style={{ color: "#64748B", textAlign: "center", padding: "40px" }}>Nenhuma transação para este mês.</div>;
                }

                return (
                  <>
                    <div style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
                      <div style={{ flex: 1, background: "#F0FDF4", padding: "16px", borderRadius: "8px", border: "1px solid #BBF7D0" }}>
                        <div style={{ fontSize: "14px", color: "#166534" }}>Total Entradas</div>
                        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#15803D" }}>{priceBRL(totalIncomes)}</div>
                      </div>
                      <div style={{ flex: 1, background: "#FEF2F2", padding: "16px", borderRadius: "8px", border: "1px solid #FECACA" }}>
                        <div style={{ fontSize: "14px", color: "#991B1B" }}>Total Saídas</div>
                        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#B91C1C" }}>{priceBRL(totalExpenses)}</div>
                      </div>
                      <div style={{ flex: 1, background: "#F8FAFC", padding: "16px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                        <div style={{ fontSize: "14px", color: "#1E293B" }}>Saldo Projetado</div>
                        <div style={{ fontSize: "24px", fontWeight: "bold", color: saldo >= 0 ? "#10B981" : "#EF4444" }}>{priceBRL(saldo)}</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {statementTransactions.map((tx, idx) => {
                        const isIncome = tx.type === "INCOME";
                        const isPaid = tx.isPaid;
                        const dateStr = new Date(tx.dueDate).toLocaleDateString('pt-BR', { timeZone: 'UTC', day: '2-digit', month: '2-digit' });
                        
                        return (
                          <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: "white", borderRadius: "8px", border: "1px solid #E2E8F0", borderLeft: `4px solid ${isIncome ? "#10B981" : "#EF4444"}` }}>
                            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                              <div style={{ fontWeight: "bold", color: "#64748B", width: "40px" }}>{dateStr}</div>
                              <div>
                                <div style={{ fontWeight: "bold", color: "#1E293B" }}>{tx.description}</div>
                                <div style={{ fontSize: "12px", color: isPaid ? "#10B981" : "#64748B", fontWeight: isPaid ? "bold" : "normal" }}>
                                  {isPaid ? "PAGO" : "A PAGAR"} • {tx.source === "MANUAL" ? "Manual" : "Regra"}
                                </div>
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                              <strong style={{ color: isIncome ? "#10B981" : "#EF4444", fontSize: "16px" }}>{isIncome ? "+" : "-"}{priceBRL(tx.amount)}</strong>
                              <button onClick={() => setEditingTx(tx)} style={{ padding: "6px 16px", background: "transparent", border: "1px solid #CBD5E1", color: "#64748B", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>Editar</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </section>
      )}

      {deleteModalTxId && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", padding: "24px", borderRadius: "12px", maxWidth: "400px", width: "90%" }}>
            <h3 style={{ marginTop: 0, color: "#1E293B" }}>Encerrar Regra</h3>
            <p style={{ color: "#475569", fontSize: "14px", lineHeight: "1.5" }}>
              Esta ação irá parar os lançamentos futuros a partir de hoje. Por padrão, o seu histórico passado será mantido.
            </p>
            
            {!showAdvancedDelete && (
              <button onClick={() => setShowAdvancedDelete(true)} style={{ background: "none", border: "none", color: "#EF4444", textDecoration: "underline", fontSize: "12px", cursor: "pointer", padding: 0, marginTop: "8px" }}>
                Deseja apagar todo o histórico passado também?
              </button>
            )}

            {showAdvancedDelete && (
              <div style={{ marginTop: "16px", padding: "12px", background: "#FEF2F2", borderRadius: "8px", border: "1px solid #FECACA" }}>
                <p style={{ fontSize: "12px", color: "#991B1B", margin: "0 0 8px 0" }}>Para apagar <strong>TODO</strong> o histórico, digite <strong>deletar</strong> abaixo:</p>
                <input 
                  type="text" 
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="deletar"
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #FCA5A5" }}
                />
                <button 
                  onClick={() => handleDelete(deleteModalTxId, true)} 
                  disabled={deleteConfirmText !== "deletar"}
                  style={{ width: "100%", padding: "12px", background: deleteConfirmText === "deletar" ? "#EF4444" : "#FCA5A5", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: deleteConfirmText === "deletar" ? "pointer" : "not-allowed", marginTop: "12px" }}>
                  Apagar Tudo (Histórico + Futuro)
                </button>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "24px" }}>
              <button onClick={() => handleDelete(deleteModalTxId, false)} style={{ padding: "12px", background: "#3B82F6", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
                Encerrar Agora (Manter Histórico)
              </button>
              <button onClick={() => { setDeleteModalTxId(null); setShowAdvancedDelete(false); setDeleteConfirmText(""); }} style={{ padding: "12px", background: "transparent", color: "#64748B", border: "1px solid #CBD5E1", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
