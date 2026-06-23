import { ICreateTreasuryMovementDTO } from "@/modules/treasury/dtos/ICreateTreasuryMovementDTO";
import { ITreasuryMovement } from "@/modules/treasury/entities/ITreasuryMovement";

export interface ITreasuryMovementRepository {
  create(data: ICreateTreasuryMovementDTO): Promise<ITreasuryMovement>;
  findByTreasuryId(treasuryId: string): Promise<ITreasuryMovement[]>;
  findByTreasuryIds(treasuryIds: string[]): Promise<ITreasuryMovement[]>;
  findById(id: string): Promise<ITreasuryMovement | null>;
  delete(id: string): Promise<void>;
  deleteByTreasuryId(treasuryId: string): Promise<void>;
}
