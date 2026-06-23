import { ICreateTreasurySnapshotDTO } from "@/modules/treasury/dtos/ICreateTreasurySnapshotDTO";
import { ITreasurySnapshot } from "@/modules/treasury/entities/ITreasurySnapshot";

export interface ITreasurySnapshotRepository {
  create(data: ICreateTreasurySnapshotDTO): Promise<ITreasurySnapshot>;
  findByTreasuryId(treasuryId: string): Promise<ITreasurySnapshot[]>;
  findById(id: string): Promise<ITreasurySnapshot | null>;
  deleteByTreasuryId(treasuryId: string): Promise<void>;
}
