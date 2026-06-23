import React, { useCallback } from 'react';
import { Card } from '../../components/ui/Card';
import { ForecastMonthCard } from './ForecastMonthCard';
import styles from './ForecastTimeline.module.css';

interface ForecastTimelineProps {
  availableYears: number[];
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  timelineToShow: any[];
  expandedDate: string | null;
  setExpandedDate: (date: string | null) => void;
}

export const ForecastTimeline: React.FC<ForecastTimelineProps> = ({
  availableYears,
  selectedYear,
  setSelectedYear,
  timelineToShow,
  expandedDate,
  setExpandedDate
}) => {
  const handleToggle = useCallback((date: string | null) => {
    setExpandedDate(date);
  }, [setExpandedDate]);

  return (
    <Card style={{ marginTop: '24px' }}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Demonstração do Resultado Mês a Mês</h3>
          <p className={styles.subtitle}>Expanda um mês para ver a DRE detalhada de todas as entradas e saídas.</p>
        </div>
        
        <select 
          value={selectedYear} 
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className={styles.select}
        >
          {availableYears.map(y => (
            <option key={y} value={y}>Filtrar Ano: {y}</option>
          ))}
        </select>
      </div>
      
      <div className={styles.list}>
        {timelineToShow.map((month, index) => (
          <ForecastMonthCard 
            key={`${month.date}-${index}`} 
            month={month} 
            isExpanded={expandedDate === month.date} 
            onToggle={handleToggle} 
          />
        ))}
      </div>
    </Card>
  );
};
