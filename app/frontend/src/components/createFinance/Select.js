import styles from "./Select.module.css"

import { useState } from "react";

export function Select() {

	const [financeType, setFinanceType] = useState("")

	const handleSelect = (event) => {
    setFinanceType(event.target.value);
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
        <option value="Aluguel"> Aluguel</option>
        <option value="CDB"> CDB</option>
        <option value="Tesouro Direto"> Tesouro Direto </option>
      </select>
    </div>
  );
}
