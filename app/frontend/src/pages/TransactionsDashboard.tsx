// @ts-nocheck
import { useEffect, useState } from "react";
import axiosRepositoryInstance from "../repository/AxiosRepository";
import styles from "./ForecastDashboard.module.css";
import { toast } from "react-toastify";

import { TransactionsForm } from "./TransactionsDashboardComponents/TransactionsForm";
import { RulesList } from "./TransactionsDashboardComponents/RulesList";
import { DeactivatedRules } from "./TransactionsDashboardComponents/DeactivatedRules";
import { MonthlyStatement } from "./TransactionsDashboardComponents/MonthlyStatement";
import { TransactionsModals } from "./TransactionsDashboardComponents/TransactionsModals";

export function TransactionsDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <TransactionsForm onTransactionCreated={fetchTransactions} />

          <RulesList 
            loading={loading}
            incomes={incomes}
            expenses={expenses}
            editingRule={editingRule}
            setEditingRule={setEditingRule}
            setDeleteModalTxId={setDeleteModalTxId}
            onRuleUpdated={fetchTransactions}
          />

          <DeactivatedRules 
            deactivatedIncomes={deactivatedIncomes}
            deactivatedExpenses={deactivatedExpenses}
            setDeleteModalTxId={setDeleteModalTxId}
          />
        </>
      )}

      {activeTab === "MONTHLY" && (
        <MonthlyStatement 
          statementDate={statementDate}
          setStatementDate={setStatementDate}
          transactions={transactions}
          editingTx={editingTx}
          setEditingTx={setEditingTx}
          mockUpload={mockUpload}
          setMockUpload={setMockUpload}
          onTransactionUpdated={fetchTransactions}
        />
      )}

      <TransactionsModals 
        deleteModalTxId={deleteModalTxId}
        setDeleteModalTxId={setDeleteModalTxId}
        showAdvancedDelete={showAdvancedDelete}
        setShowAdvancedDelete={setShowAdvancedDelete}
        deleteConfirmText={deleteConfirmText}
        setDeleteConfirmText={setDeleteConfirmText}
        handleDelete={handleDelete}
      />
    </div>
  );
}
