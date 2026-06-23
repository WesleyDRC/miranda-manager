export type MarketDataType = "SELIC" | "IPCA" | "TREASURY" | "IPCA_FOCUS";

export interface IMarketSnapshot {
  id: string;
  type: MarketDataType;
  referenceDate: Date;
  value: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
