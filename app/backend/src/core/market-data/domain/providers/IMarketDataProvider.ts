import { IMarketSnapshot } from "@/core/market-data/domain/entities/MarketSnapshot";

export interface IMarketDataProvider {
  getSelicCurrent(): Promise<number>;
  getSelicHistory(): Promise<IMarketSnapshot[]>;
  getIpcaCurrent(): Promise<number>;
  getIpcaHistory(): Promise<IMarketSnapshot[]>;
  getIpcaFocusProjection(): Promise<number>;
  getTreasuryPrices(): Promise<IMarketSnapshot[]>;
}
