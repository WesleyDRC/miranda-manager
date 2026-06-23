import React, { useEffect, useState } from "react";
import styles from "./LiveMarketRates.module.css";

interface MarketData {
  selic: number;
  ipca: number;
  timestamp: string;
}

export function LiveMarketRates() {
  const [data, setData] = useState<MarketData | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // SSE Connection
    const eventSource = new EventSource("http://localhost:5000/market-data/stream");

    eventSource.onopen = () => {
      setConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        setData(parsed);
      } catch (err) {
        console.error("Failed to parse SSE data", err);
      }
    };

    eventSource.onerror = () => {
      setConnected(false);
      eventSource.close();
      
      // Auto reconnect loop
      setTimeout(() => {
        setConnected(true); // visual cue
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className={styles.liveWidget}>
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <span className={styles.icon}>📡</span>
          <h3 className={styles.title}>Market Data ao Vivo</h3>
        </div>
        <div className={styles.statusBadge}>
          <span className={`${styles.dot} ${connected ? styles.dotActive : styles.dotOffline}`}></span>
          <span className={styles.statusText}>{connected ? "Conectado" : "Reconectando..."}</span>
        </div>
      </div>

      <div className={styles.ratesContainer}>
        <div className={styles.rateCard}>
          <span className={styles.rateLabel}>Meta Selic</span>
          <span className={styles.rateValue}>{data ? `${data.selic.toFixed(2)}%` : "--"}</span>
        </div>
        <div className={styles.rateCard}>
          <span className={styles.rateLabel}>IPCA Focus</span>
          <span className={styles.rateValue}>{data ? `${data.ipca.toFixed(2)}%` : "--"}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.timestamp}>
          Última atualização: {data ? formatTime(data.timestamp) : "--:--:--"}
        </span>
      </div>
    </div>
  );
}
