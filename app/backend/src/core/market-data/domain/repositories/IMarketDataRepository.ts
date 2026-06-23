import { IMarketSnapshot, MarketDataType } from "@/core/market-data/domain/entities/MarketSnapshot";

export interface IMarketDataRepository {
  saveSnapshot(snapshot: Omit<IMarketSnapshot, "id" | "createdAt" | "updatedAt">): Promise<IMarketSnapshot>;
  getSnapshotsByType(type: MarketDataType): Promise<IMarketSnapshot[]>;
  getLatestSnapshot(type: MarketDataType): Promise<IMarketSnapshot | null>;
}
