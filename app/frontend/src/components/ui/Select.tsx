import React, { forwardRef } from 'react';
import styles from './Select.module.css';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string | number }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, error, options, className = '', id, ...props }, ref) => {
  const selectId = id || props.name;
  
  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && <label htmlFor={selectId} className={styles.label}>{label}</label>}
      <select 
        id={selectId}
        ref={ref}
        className={`${styles.select} ${error ? styles.selectError : ''}`}
        {...props}
      >
        <option value="" disabled>Selecione...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
});

Select.displayName = 'Select';
