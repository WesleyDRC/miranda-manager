import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Table } from '../../components/ui/Table';
import { toast } from 'react-toastify';
import axiosRepositoryInstance from '../../repository/AxiosRepository';
import priceBRL from '../../utils/formatPrice';

interface IImportExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
  treasuries: any[];
  products: any[];
  ipcaRate: string;
  selicRate: string;
}

export function ImportExcelModal({ isOpen, onClose, onImportSuccess, treasuries, products, ipcaRate, selicRate }: IImportExcelModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [rows, setRows] = useState<any[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handlePreview = async () => {
    if (!file) {
      toast.warning('Selecione um arquivo Excel primeiro.');
      return;
    }
    setLoading(true);
    try {
      const response = await axiosRepositoryInstance.previewTreasuryExcel(file);
      setPreviewData(response.data);
      // Inicia as linhas editáveis
      setRows(response.data.rows.map((r: any) => ({
        ...r,
        fixedRate: r.fixedRate || '',
        selicRate: r.selicRate || '',
        annualRate: r.totalRate || '',
        existingTreasuryId: '',
        isValid: false
      })));
      setSelectedProduct('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao ler arquivo Excel.');
    } finally {
      setLoading(false);
    }
  };

  const handleRowChange = (index: number, field: string, value: any) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);
  };

  const updateRowsWithTitle = (productName: string) => {
    const titleToSearch = productName;
    
    let type = "PREFIXADO";
    const existingTreasury = treasuries.find(t => t.titleName === titleToSearch);
    const prod = products.find(p => p.name === productName);
    if (existingTreasury) type = existingTreasury.treasuryType;
    else if (prod) type = prod.treasuryType;
    else if (titleToSearch.toUpperCase().includes('IPCA')) type = 'IPCA';
    else if (titleToSearch.toUpperCase().includes('SELIC')) type = 'SELIC';

    const defaultIndexer = type.includes('IPCA') ? ipcaRate : (type.includes('SELIC') ? selicRate : '');

    setRows(rows => rows.map(r => ({ 
      ...r, 
      titleName: titleToSearch, 
      isValid: !!titleToSearch,
      selicRate: r.selicRate || defaultIndexer
    })));
  };

  const handleGlobalTreasuryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedProduct(val);
    updateRowsWithTitle(val);
  };



  const handleConfirm = async () => {
    if (!rows) return;
    
    const validRows = rows.filter((r: any) => r.isValid && r.titleName);
    
    if (validRows.length === 0) {
      toast.warning('Nenhum aporte válido com título vinculado para importar.');
      return;
    }

    setLoading(true);
    try {
      // Find product details to send along
      const prod = products.find(p => p.name === selectedProduct);
      const payload = validRows.map(r => ({
        ...r,
        productDetails: prod ? {
          treasuryType: prod.treasuryType,
          maturityDate: prod.maturityDate
        } : null
      }));

      const response = await axiosRepositoryInstance.confirmTreasuryImport(payload);
      const { totalImported, totalDuplicates, totalFailed } = response.data;
      
      toast.success(`${totalImported} aportes importados com sucesso!`);
      if (totalDuplicates > 0) toast.info(`${totalDuplicates} aportes ignorados (já existiam).`);
      if (totalFailed > 0) toast.warning(`${totalFailed} falharam na importação.`);
      
      onImportSuccess();
      handleClose();
    } catch (err) {
      toast.error('Erro ao confirmar importação.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreviewData(null);
    setRows([]);
    setSelectedProduct('');
    onClose();
  };

  const previewColumns = [
    { key: "date", title: "Data", render: (r: any) => r.date ? new Date(r.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-' },
    { key: "investedAmount", title: "Valor", render: (r: any) => r.investedAmount ? priceBRL(r.investedAmount) : '-' },
    { key: "quantity", title: "Qtd.", render: (r: any) => r.quantity ? r.quantity : '-' },
    { key: "unitPrice", title: "PU", render: (r: any) => r.unitPrice ? priceBRL(r.unitPrice) : '-' },
    { 
      key: "rates", 
      title: "Taxas (%)", 
      render: (r: any) => {
        const idx = rows.findIndex(row => row === r);
        const titleToSearch = selectedProduct;
        
        if (!titleToSearch) return <span style={{fontSize: 12, color: '#888'}}>Selecione o título primeiro</span>;
        
        // Find treasury type
        let type = "PREFIXADO"; // default fallback
        const existingTreasury = treasuries.find(t => t.titleName === titleToSearch);
        const prod = products.find(p => p.name === selectedProduct);
        if (existingTreasury) type = existingTreasury.treasuryType;
        else if (prod) type = prod.treasuryType;
        else if (titleToSearch.toUpperCase().includes('IPCA')) type = 'IPCA';
        else if (titleToSearch.toUpperCase().includes('SELIC')) type = 'SELIC';
        
        if (type.includes('IPCA') || type.includes('SELIC')) {
          const isIPCA = type.includes('IPCA');
          return (
            <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
              <input 
                type="number" step="0.01" placeholder="Taxa Fixa" 
                value={r.fixedRate} onChange={(e) => handleRowChange(idx, 'fixedRate', e.target.value)}
                style={{ width: '80px', padding: '2px' }} title="Taxa Fixa"
              />
              <input 
                type="number" step="0.01" placeholder={isIPCA ? "IPCA" : "Selic"} 
                value={r.selicRate} onChange={(e) => handleRowChange(idx, 'selicRate', e.target.value)}
                style={{ width: '80px', padding: '2px' }} title={isIPCA ? "Projeção IPCA" : "Projeção Selic"}
              />
            </div>
          );
        } else {
          return (
            <input 
              type="number" step="0.01" placeholder="Anual" 
              value={r.annualRate} onChange={(e) => handleRowChange(idx, 'annualRate', e.target.value)}
              style={{ width: '80px', padding: '2px' }} title="Taxa Anual"
            />
          );
        }
      } 
    },
    { key: "status", title: "Status", render: (r: any) => (r.isValid && r.titleName) ? <span style={{ color: 'green' }}>✅ Válido</span> : <span style={{ color: 'red' }} title={r.errors?.join(', ')}>❌ Pendente</span> }
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Importar Extrato do Tesouro Direto" maxWidth="1000px">
      <div style={{ padding: '20px' }}>
        {!previewData ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <p>Selecione o arquivo Excel exportado do Portal do Investidor (.xls ou .xlsx).</p>
            <input 
              type="file" 
              accept=".xls,.xlsx" 
              onChange={handleFileChange} 
              style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <Button onClick={handlePreview} disabled={!file || loading} isLoading={loading}>
              Visualizar Dados
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', background: '#F3F4F6', padding: '10px', borderRadius: '4px' }}>
              <div><strong>Encontrados:</strong> {previewData.totalFound}</div>
              <div><strong style={{ color: 'green' }}>Válidos Prontos:</strong> {rows.filter(r => r.isValid && r.titleName).length}</div>
              <div><strong style={{ color: '#F59E0B' }}>Ignorados (Vazios):</strong> {previewData.totalIgnored}</div>
              <div><strong style={{ color: 'red' }}>Pendentes/Erros:</strong> {rows.filter(r => !r.isValid || !r.titleName).length}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', background: '#E0E7FF', padding: '15px', borderRadius: '4px', border: '1px solid #C7D2FE' }}>
              <label style={{ fontWeight: 'bold', color: '#3730A3' }}>Nome do Título Oficial</label>
              <select 
                value={selectedProduct} 
                onChange={handleGlobalTreasuryChange}
                style={{ padding: '8px', borderRadius: '4px', border: selectedProduct ? '1px solid #ccc' : '1px solid red' }}
              >
                <option value="">-- Selecione o Título --</option>
                {products.map(p => (
                  <option key={p.name} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
            
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <Table 
                columns={previewColumns} 
                data={rows} 
                emptyMessage="Nenhuma linha pôde ser lida." 
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <Button variant="secondary" onClick={() => setPreviewData(null)} disabled={loading}>Voltar</Button>
              <Button onClick={handleConfirm} disabled={rows.filter(r => r.isValid && r.titleName).length === 0 || loading} isLoading={loading}>
                Confirmar Importação
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
