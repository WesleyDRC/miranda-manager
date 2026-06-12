import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axiosRepositoryInstance from "../repository/AxiosRepository";
import styles from "./ForecastDashboard.module.css";
import priceBRL from "../utils/formatPrice";
import { toast } from "react-toastify";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { FaTrash, FaEdit, FaWallet } from "react-icons/fa";
import { Card } from "../components/ui/Card";

export function WalletsDashboard() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingWallet, setEditingWallet] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  
  const { 
    register: registerEdit, 
    handleSubmit: handleEditSubmit, 
    reset: resetEdit, 
    formState: { errors: errorsEdit, isSubmitting: isSubmittingEdit } 
  } = useForm();

  const fetchWallets = async () => {
    try {
      setLoading(true);
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

  const onCreate = async (data) => {
    try {
      await axiosRepositoryInstance.createWallet({
        name: data.name,
        balance: Number(data.balance)
      });
      toast.success("Conta criada com sucesso!");
      reset();
      fetchWallets();
    } catch (err) {
      toast.error("Erro ao criar conta.");
    }
  };

  const onEdit = async (data) => {
    try {
      await axiosRepositoryInstance.updateWallet(editingWallet.id, {
        name: data.name,
        balance: Number(data.balance)
      });
      toast.success("Conta atualizada com sucesso!");
      setEditingWallet(null);
      fetchWallets();
    } catch (err) {
      toast.error("Erro ao atualizar conta.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja apagar esta conta permanentemente?")) {
      try {
        await axiosRepositoryInstance.deleteWallet(id);
        toast.success("Conta removida.");
        fetchWallets();
      } catch (err) {
        toast.error("Erro ao remover conta.");
      }
    }
  };

  const openEditModal = (wallet) => {
    setEditingWallet(wallet);
    resetEdit({ name: wallet.name, balance: wallet.balance });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Minhas Contas (Wallets)</h1>
        <p className={styles.subtitle}>Gerencie o saldo atual do seu dinheiro.</p>
      </header>

      <section className={styles.chartSection} style={{ marginBottom: "24px" }}>
        <h3>Nova Conta</h3>
        <form onSubmit={handleSubmit(onCreate)} style={{ display: "flex", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
          <div style={{ flex: 2, minWidth: '200px' }}>
            <Input 
              label="Nome da Conta"
              placeholder="Ex: Nubank, Itaú..." 
              {...register('name', { required: 'Nome é obrigatório' })}
              error={errors.name?.message}
            />
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <Input 
              label="Saldo Atual (R$)"
              type="number"
              step="0.01"
              placeholder="0.00" 
              {...register('balance', { required: 'Saldo é obrigatório', valueAsNumber: true })}
              error={errors.balance?.message}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: errors.name || errors.balance ? '22px' : '0' }}>
            <Button type="submit" variant="primary" disabled={isSubmitting} style={{ height: '42px', marginTop: '22px' }}>
              {isSubmitting ? "Salvando..." : "Adicionar Conta"}
            </Button>
          </div>
        </form>
      </section>

      <div>
        <h3 style={{ color: '#1E293B', marginBottom: '16px' }}>Suas Contas</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {loading ? (
            <div className={styles.loading}>Carregando...</div>
          ) : wallets.length === 0 ? (
            <div style={{ color: "#64748B" }}>Nenhuma conta cadastrada.</div>
          ) : (
            wallets.map(wallet => (
              <Card key={wallet.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '4px solid #5E17EB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: '#EDE9FE', color: '#5E17EB', padding: '12px', borderRadius: '50%' }}>
                      <FaWallet size={20} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, color: '#1E293B', fontSize: '18px' }}>{wallet.name}</h4>
                      <div style={{ fontSize: '13px', color: '#64748B' }}>Saldo Atual</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => openEditModal(wallet)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }} title="Editar">
                      <FaEdit size={16} />
                    </button>
                    <button onClick={() => handleDelete(wallet.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }} title="Apagar">
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
                <div>
                  <strong style={{ fontSize: '24px', color: wallet.balance >= 0 ? '#10B981' : '#EF4444' }}>
                    {priceBRL(wallet.balance)}
                  </strong>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <Modal 
        isOpen={!!editingWallet} 
        onClose={() => setEditingWallet(null)} 
        title="Editar Conta"
        maxWidth="400px"
      >
        <form onSubmit={handleEditSubmit(onEdit)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Input 
            label="Nome da Conta"
            {...registerEdit('name', { required: 'Nome é obrigatório' })}
            error={errorsEdit.name?.message}
          />
          <Input 
            label="Saldo Atual (R$)"
            type="number"
            step="0.01"
            {...registerEdit('balance', { required: 'Saldo é obrigatório', valueAsNumber: true })}
            error={errorsEdit.balance?.message}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
            <Button variant="secondary" onClick={() => setEditingWallet(null)} type="button">Cancelar</Button>
            <Button variant="primary" type="submit" disabled={isSubmittingEdit}>
              {isSubmittingEdit ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
