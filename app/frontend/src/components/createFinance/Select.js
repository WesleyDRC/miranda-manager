import styles from "./Select.module.css"

import { useState } from "react";

export function Select({ onSelect, options = [] }) {

	const [financeType, setFinanceType] = useState("")

	const handleSelect = (event) => {
    setFinanceType(event.target.value);
    onSelect(event.target.value)
  };

  return (
    <div className={styles.customSelect}>
      <select
        value={financeType}
        className={styles.select}
        onChange={handleSelect}
      >
        <option value="" disabled>
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.type}> {option.type} </option>
        ))}
      </select>
    </div>
  );
}
