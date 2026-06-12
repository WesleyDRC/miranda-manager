import React from 'react';
import axiosRepositoryInstance from '../../repository/AxiosRepository';
import { toast } from 'react-toastify';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import styles from '../ForecastDashboard.module.css';
import { useForm, SubmitHandler } from 'react-hook-form';

interface TransactionsFormProps {
  onTransactionCreated: () => void;
}

interface IFormInput {
  type: string;
  description: string;
  amount: number;
  startDate: string;
  dueDateDay: number;
  endDate: string;
}

export const TransactionsForm: React.FC<TransactionsFormProps> = ({ onTransactionCreated }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<IFormInput>({
    defaultValues: { type: 'INCOME' }
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      let baseDate = new Date();
      if (data.startDate) {
        const [year, month] = data.startDate.split('-');
        baseDate = new Date(Number(year), Number(month) - 1, 1);
      }
      baseDate.setDate(Number(data.dueDateDay));

      await axiosRepositoryInstance.createTransaction({
        type: data.type,
        amount: Number(data.amount),
        dueDate: baseDate,
        isPaid: false,
        isRecurring: true,
        source: 'MANUAL',
        description: data.description,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        walletId: undefined,
        patrimonyId: undefined
      });

      toast.success('Adicionado com sucesso!');
      reset();
      onTransactionCreated();
    } catch (err) {
      toast.error('Erro ao adicionar.');
    }
  };

  return (
    <section className={styles.chartSection} style={{ marginBottom: '24px' }}>
      <h3>Novo Lançamento Fixo/Mensal</h3>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <Select 
            label="Tipo"
            {...register('type', { required: 'Obrigatório' })}
            error={errors.type?.message}
            options={[
              { label: 'Entrada (Ex: Salário)', value: 'INCOME' },
              { label: 'Saída (Ex: Luz, Mercado)', value: 'EXPENSE' }
            ]}
          />
        </div>
        <div style={{ flex: 2, minWidth: '200px' }}>
          <Input 
            label="Descrição"
            type="text" 
            placeholder="Ex: Salário da Empresa X" 
            {...register('description', { required: 'Descrição é obrigatória' })}
            error={errors.description?.message}
          />
        </div>
        <div style={{ flex: 1, minWidth: '120px' }}>
          <Input 
            label="Valor (R$)"
            type="number" 
            step="0.01" 
            placeholder="0.00" 
            {...register('amount', { 
              required: 'Valor obrigatório', 
              valueAsNumber: true,
              min: { value: 0.01, message: 'Valor deve ser maior que 0' }
            })}
            error={errors.amount?.message}
          />
        </div>
        <div style={{ flex: 1, minWidth: '120px' }}>
          <Input 
            label="Dia de Vencimento"
            type="number" 
            placeholder="Dia" 
            {...register('dueDateDay', { 
              required: 'Dia obrigatório', 
              valueAsNumber: true,
              min: { value: 1, message: 'Mínimo dia 1' },
              max: { value: 31, message: 'Máximo dia 31' }
            })}
            error={errors.dueDateDay?.message}
          />
        </div>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <Input 
            label="Mês de Início"
            type="month" 
            {...register('startDate')}
            error={errors.startDate?.message}
          />
        </div>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <Input 
            label="Até (Opcional)"
            type="date" 
            {...register('endDate')}
          />
        </div>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={isSubmitting}
            style={{ height: '42px', minWidth: '150px' }}
          >
            {isSubmitting ? 'Adicionando...' : 'Adicionar'}
          </Button>
        </div>
      </form>
    </section>
  );
};
