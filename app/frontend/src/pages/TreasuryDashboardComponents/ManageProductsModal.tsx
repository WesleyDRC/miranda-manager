import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { toast } from 'react-toastify';
import axiosRepositoryInstance from '../../repository/AxiosRepository';
import { Table } from '../../components/ui/Table';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface IManageProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ManageProductsModal({ isOpen, onClose, onSuccess }: IManageProductsModalProps) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  
  // Form state
  const [mode, setMode] = useState<'CREATE' | 'EDIT'>('CREATE');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [treasuryType, setTreasuryType] = useState('SELIC');
  const [maturityDate, setMaturityDate] = useState('');

  const fetchProducts = async () => {
    try {
      const pRes = await axiosRepositoryInstance.getTreasuryProducts();
      setProducts(pRes.data.products || []);
    } catch (err) {
      toast.error('Erro ao buscar produtos.');
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setMode('CREATE');
    setEditingId(null);
    setName('');
    setTreasuryType('SELIC');
    setMaturityDate('');
  };

  const handleEditClick = (product: any) => {
    setMode('EDIT');
    setEditingId(product._id);
    setName(product.name);
    setTreasuryType(product.treasuryType);
    if (product.maturityDate) {
      setMaturityDate(new Date(product.maturityDate).toISOString().split('T')[0]);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir este Título Oficial? Ele não aparecerá mais na lista.")) return;
    
    setLoading(true);
    try {
      await axiosRepositoryInstance.deleteTreasuryProduct(id);
      toast.success('Título Oficial excluído.');
      fetchProducts();
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao excluir Título.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !treasuryType || !maturityDate) {
      toast.warning('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'CREATE') {
        await axiosRepositoryInstance.createTreasuryProduct({
          name,
          treasuryType,
          maturityDate: new Date(maturityDate).toISOString()
        });
        toast.success('Título Oficial criado com sucesso!');
      } else {
        await axiosRepositoryInstance.updateTreasuryProduct(editingId, {
          name,
          treasuryType,
          maturityDate: new Date(maturityDate).toISOString()
        });
        toast.success('Título Oficial atualizado com sucesso!');
      }
      resetForm();
      fetchProducts();
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao salvar Título Oficial.');
    } finally {
      setLoading(false);
    }
  };

  const tableColumns = [
    { key: "name", title: "Nome do Título", render: (r: any) => <strong>{r.name}</strong> },
    { key: "treasuryType", title: "Tipo", render: (r: any) => r.treasuryType.replace("_", " ") },
    { key: "maturityDate", title: "Vencimento", render: (r: any) => new Date(r.maturityDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) },
    { 
      key: "actions", 
      title: "Ações", 
      render: (r: any) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleEditClick(r)} style={{ color: '#4F46E5', background: 'none', border: 'none', cursor: 'pointer' }} title="Editar">
            <FaEdit size={16} />
          </button>
          <button onClick={() => handleDelete(r._id)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }} title="Excluir">
            <FaTrash size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gerenciar Títulos Oficiais" maxWidth="800px">
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Formulário */}
        <div style={{ background: '#F9FAFB', padding: '15px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
          <h4 style={{ marginBottom: '15px', color: '#111827' }}>
            {mode === 'CREATE' ? 'Criar Novo Título' : 'Editar Título'}
          </h4>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nome do Título</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Ex: Tesouro Selic 2031" 
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tipo do Tesouro</label>
                <select 
                  value={treasuryType} 
                  onChange={e => setTreasuryType(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="SELIC">Tesouro Selic</option>
                  <option value="PREFIXADO">Tesouro Prefixado</option>
                  <option value="PREFIXADO_JUROS">Prefixado com Juros Semestrais</option>
                  <option value="IPCA">Tesouro IPCA+</option>
                  <option value="IPCA_JUROS">IPCA+ com Juros Semestrais</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Data de Vencimento</label>
                <input 
                  type="date" 
                  value={maturityDate} 
                  onChange={e => setMaturityDate(e.target.value)} 
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  required
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              {mode === 'EDIT' && (
                <Button type="button" variant="secondary" onClick={resetForm} disabled={loading}>Cancelar Edição</Button>
              )}
              <Button type="submit" isLoading={loading}>
                {mode === 'CREATE' ? 'Criar Título' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </div>

        {/* Lista */}
        <div>
          <h4 style={{ marginBottom: '10px', color: '#111827' }}>Títulos Cadastrados</h4>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Table 
              data={products} 
              columns={tableColumns} 
              emptyMessage="Nenhum título encontrado." 
            />
          </div>
        </div>

      </div>
    </Modal>
  );
}
