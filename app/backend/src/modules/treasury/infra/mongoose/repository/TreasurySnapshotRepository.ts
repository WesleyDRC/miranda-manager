import { ITreasurySnapshotRepository } from "@/modules/treasury/repositories/ITreasurySnapshotRepository";
import { ICreateTreasurySnapshotDTO } from "@/modules/treasury/dtos/ICreateTreasurySnapshotDTO";
import { ITreasurySnapshot } from "@/modules/treasury/entities/ITreasurySnapshot";
import { TreasurySnapshot } from "@/modules/treasury/infra/mongoose/entities/TreasurySnapshot";

export class TreasurySnapshotRepository implements ITreasurySnapshotRepository {
  private toEntity(doc: any): ITreasurySnapshot {
    return {
      id: doc._id,
      treasuryId: doc.treasuryId,
      snapshotDate: doc.snapshotDate,
      currentValue: doc.currentValue,
      projectedValue: doc.projectedValue,
      createdAt: doc.createdAt,
    };
  }

  async create(data: ICreateTreasurySnapshotDTO): Promise<ITreasurySnapshot> {
    const created = await TreasurySnapshot.create(data);
    return this.toEntity(created);
  }

  async findByTreasuryId(treasuryId: string): Promise<ITreasurySnapshot[]> {
    const docs = await TreasurySnapshot.find({ treasuryId }).sort({ snapshotDate: -1 });
    return docs.map((doc) => this.toEntity(doc));
  }

  async findById(id: string): Promise<ITreasurySnapshot | null> {
    const doc = await TreasurySnapshot.findOne({ _id: id });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async deleteByTreasuryId(treasuryId: string): Promise<void> {
    await TreasurySnapshot.deleteMany({ treasuryId });
  }
}
