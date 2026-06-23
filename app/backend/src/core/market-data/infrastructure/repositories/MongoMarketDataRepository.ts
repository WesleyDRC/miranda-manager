import { IMarketDataRepository } from "@/core/market-data/domain/repositories/IMarketDataRepository";
import { IMarketSnapshot, MarketDataType } from "@/core/market-data/domain/entities/MarketSnapshot";
import { MarketSnapshotModel } from "@/core/market-data/infrastructure/mongoose/entities/MarketSnapshotModel";

export class MongoMarketDataRepository implements IMarketDataRepository {
  private toEntity(doc: any): IMarketSnapshot {
    return {
      id: doc._id,
      type: doc.type,
      referenceDate: doc.referenceDate,
      value: doc.value,
      metadata: doc.metadata,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async saveSnapshot(
    snapshot: Omit<IMarketSnapshot, "id" | "createdAt" | "updatedAt">
  ): Promise<IMarketSnapshot> {
    const created = await MarketSnapshotModel.create(snapshot);
    return this.toEntity(created);
  }

  async getSnapshotsByType(type: MarketDataType): Promise<IMarketSnapshot[]> {
    const docs = await MarketSnapshotModel.find({ type }).sort({ referenceDate: -1 });
    return docs.map((doc) => this.toEntity(doc));
  }

  async getLatestSnapshot(type: MarketDataType): Promise<IMarketSnapshot | null> {
    const doc = await MarketSnapshotModel.findOne({ type }).sort({ referenceDate: -1 });
    if (!doc) return null;
    return this.toEntity(doc);
  }
}
