import React from 'react';
import { Button } from '../../components/ui/Button';

interface TransactionsModalsProps {
  deleteModalTxId: string | null;
  setDeleteModalTxId: (id: string | null) => void;
  showAdvancedDelete: boolean;
  setShowAdvancedDelete: (show: boolean) => void;
  deleteConfirmText: string;
  setDeleteConfirmText: (text: string) => void;
  handleDelete: (id: string, deleteHistory: boolean) => void;
}

export const TransactionsModals: React.FC<TransactionsModalsProps> = ({
  deleteModalTxId,
  setDeleteModalTxId,
  showAdvancedDelete,
  setShowAdvancedDelete,
  deleteConfirmText,
  setDeleteConfirmText,
  handleDelete
}) => {
  if (!deleteModalTxId) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'white', padding: '24px', borderRadius: '12px', maxWidth: '400px', width: '90%' }}>
        <h3 style={{ marginTop: 0, color: '#1E293B' }}>Encerrar Regra</h3>
        <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.5' }}>
          Esta ação irá parar os lançamentos futuros a partir de hoje. Por padrão, o seu histórico passado será mantido.
        </p>
        
        {!showAdvancedDelete && (
          <button onClick={() => setShowAdvancedDelete(true)} style={{ background: 'none', border: 'none', color: '#EF4444', textDecoration: 'underline', fontSize: '12px', cursor: 'pointer', padding: 0, marginTop: '8px' }}>
            Deseja apagar todo o histórico passado também?
          </button>
        )}

        {showAdvancedDelete && (
          <div style={{ marginTop: '16px', padding: '12px', background: '#FEF2F2', borderRadius: '8px', border: '1px solid #FECACA' }}>
            <p style={{ fontSize: '12px', color: '#991B1B', margin: '0 0 8px 0' }}>Para apagar <strong>TODO</strong> o histórico, digite <strong>deletar</strong> abaixo:</p>
            <input 
              type="text" 
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="deletar"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #FCA5A5' }}
            />
            <Button 
              variant="danger"
              onClick={() => handleDelete(deleteModalTxId, true)} 
              disabled={deleteConfirmText !== 'deletar'}
              style={{ width: '100%', marginTop: '12px' }}
            >
              Apagar Tudo (Histórico + Futuro)
            </Button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
          <Button variant="primary" onClick={() => handleDelete(deleteModalTxId, false)}>
            Encerrar Agora (Manter Histórico)
          </Button>
          <Button variant="secondary" onClick={() => { setDeleteModalTxId(null); setShowAdvancedDelete(false); setDeleteConfirmText(''); }}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
};
