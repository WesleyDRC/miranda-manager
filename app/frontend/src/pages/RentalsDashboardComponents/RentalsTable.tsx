import React, { useState, useMemo } from 'react';
import { Table } from '../../components/ui/Table';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import priceBRL from '../../utils/formatPrice';
import { FaSearch } from "react-icons/fa";
import styles from '../RentalsDashboard.module.css';

interface RentalsTableProps {
  rentals: any[];
  onSelectRent: (rent: any) => void;
}

export const RentalsTable: React.FC<RentalsTableProps> = ({ rentals, onSelectRent }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [sortField, setSortField] = useState('tenant-asc');

  const filteredRentals = useMemo(() => {
    let list = [...rentals];

    if (search.trim() !== '') {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.tenant.toLowerCase().includes(q) ||
          r.street.toLowerCase().includes(q) ||
          r.streetNumber.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'Todos') {
      list = list.filter((r) => r.status === statusFilter);
    }

    // Sort manual logic specific to the dropdown (not column sorting)
    list.sort((a, b) => {
      const [field, order] = sortField.split('-');
      let valA = a[field];
      let valB = b[field];

      if (field === 'value' || field === 'totalPaid' || field === 'totalDebt') {
        valA = parseFloat(valA) || 0;
        valB = parseFloat(valB) || 0;
      } else {
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      }

      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [rentals, search, statusFilter, sortField]);

  const columns = [
    {
      key: 'tenant',
      title: 'Inquilino / Imóvel',
      sortable: true,
      render: (record: any) => (
        <div className={styles.tenantCell}>
          <span className={styles.tenantName}>{record.tenant}</span>
          <span className={styles.propertyAddress}>
            {record.street}, {record.streetNumber}
          </span>
        </div>
      ),
    },
    {
      key: 'value',
      title: 'Valor do Aluguel',
      sortable: true,
      render: (record: any) => (
        <span className={styles.rentValue}>{priceBRL(parseFloat(record.value) || 0)}</span>
      ),
    },
    {
      key: 'status',
      title: 'Status do Mês',
      render: (record: any) => {
        const variant = record.status === 'Pago' ? 'success' : record.status === 'Atrasado' ? 'danger' : 'warning';
        return <Badge variant={variant}>{record.status}</Badge>;
      },
    },
    {
      key: 'totalPaid',
      title: 'Total Pago',
      sortable: true,
      render: (record: any) => {
        const rentVal = parseFloat(record.value) || 0;
        const paidRatio = rentVal > 0 ? (record.totalPaid / (record.totalPaid + record.totalDebt)) * 100 : 0;
        return (
          <div className={styles.progressCell}>
            <span>{priceBRL(record.totalPaid)}</span>
            <div className={styles.progressBarBg}>
              <div
                className={styles.progressBarFill}
                style={{
                  width: `${Math.min(paidRatio, 100)}%`,
                  backgroundColor: record.status === 'Atrasado' ? 'var(--danger)' : 'var(--success)',
                }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'totalDebt',
      title: 'Em Aberto',
      sortable: true,
      render: (record: any) => (
        <span className={record.totalDebt > 0 ? styles.textDebt : styles.textZeroDebt}>
          {priceBRL(record.totalDebt)}
        </span>
      ),
    },
    {
      key: 'lastPaymentDate',
      title: 'Último Pagamento',
    },
    {
      key: 'nextDue',
      title: 'Próximo Vencimento',
      render: (record: any) => (
        <span className={record.status === 'Atrasado' ? styles.dueDateAlert : ''}>
          {record.nextDue}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Ações',
      render: (record: any) => (
        <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); onSelectRent(record); }}>
          Detalhes
        </Button>
      ),
    },
  ];

  return (
    <section className={styles.tableSection}>
      <div className={styles.tableControls}>
        <div className={styles.searchBox} style={{ flex: 1 }}>
          <Input
            placeholder="Buscar por inquilino ou endereço..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '32px' }}
          />
          <FaSearch className={styles.searchIcon} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748B' }} />
        </div>

        <div className={styles.filterBox} style={{ display: 'flex', gap: '12px' }}>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: 'Todos os Status', value: 'Todos' },
              { label: 'Pago', value: 'Pago' },
              { label: 'Pendente', value: 'Pendente' },
              { label: 'Atrasado', value: 'Atrasado' },
            ]}
          />
          
          <Select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            options={[
              { label: 'Inquilino (A-Z)', value: 'tenant-asc' },
              { label: 'Inquilino (Z-A)', value: 'tenant-desc' },
              { label: 'Valor (Menor-Maior)', value: 'value-asc' },
              { label: 'Valor (Maior-Menor)', value: 'value-desc' },
              { label: 'Maior Dívida', value: 'totalDebt-desc' },
            ]}
          />
        </div>
      </div>

      <Table 
        columns={columns} 
        data={filteredRentals} 
        itemsPerPage={8} 
        onRowClick={(record) => onSelectRent(record)}
      />
    </section>
  );
};
