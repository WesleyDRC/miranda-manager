import styles from "./AssetCard.module.css";

import priceBRL from "../../../utils/formatPrice"

export function AssetCard({ name, money }) {
  return (
    <div className={styles.assetCard}>
      <div className={styles.amount}>
        <p className={styles.name}>{name}</p>
        <p className={styles.money}>{priceBRL(money, true)}</p>
      </div>
      <div className={styles.dollarIcon}>
        <p>$</p>
      </div>
    </div>
  );
}
