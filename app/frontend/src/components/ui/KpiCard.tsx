import React from 'react';
import styles from './KpiCard.module.css';

interface KpiCardProps {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'default';
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ 
  icon, 
  label, 
  value, 
  subtitle, 
  variant = 'default',
  className = ''
}) => {
  const variantClass = variant === 'info' ? styles.infoVariant : styles[variant] || styles.default;

  return (
    <div className={`${styles.card} ${variantClass} ${className}`}>
      {icon && (
        <div className={styles.iconWrapper}>
          {icon}
        </div>
      )}
      <div className={styles.content}>
        <span className={styles.label}>{label}</span>
        <h2 className={styles.value}>{value}</h2>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
    </div>
  );
};
