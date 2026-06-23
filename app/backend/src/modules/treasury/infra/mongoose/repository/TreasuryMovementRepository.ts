import { ITreasuryMovementRepository } from "@/modules/treasury/repositories/ITreasuryMovementRepository";
import { ICreateTreasuryMovementDTO } from "@/modules/treasury/dtos/ICreateTreasuryMovementDTO";
import { ITreasuryMovement } from "@/modules/treasury/entities/ITreasuryMovement";
import { TreasuryMovement } from "@/modules/treasury/infra/mongoose/entities/TreasuryMovement";

export class TreasuryMovementRepository implements ITreasuryMovementRepository {
  private toEntity(doc: any): ITreasuryMovement {
    return {
      id: doc._id,
      treasuryId: doc.treasuryId,
      movementType: doc.movementType,
      amount: doc.amount,
      movementDate: doc.movementDate,
      description: doc.description,
      createdAt: doc.createdAt,
    };
  }

  async create(data: ICreateTreasuryMovementDTO): Promise<ITreasuryMovement> {
    const created = await TreasuryMovement.create(data);
    return this.toEntity(created);
  }

  async findByTreasuryId(treasuryId: string): Promise<ITreasuryMovement[]> {
    const docs = await TreasuryMovement.find({ treasuryId }).sort({ movementDate: -1 });
    return docs.map((doc) => this.toEntity(doc));
  }

  async findByTreasuryIds(treasuryIds: string[]): Promise<ITreasuryMovement[]> {
    const docs = await TreasuryMovement.find({ treasuryId: { $in: treasuryIds } }).sort({ movementDate: -1 });
    return docs.map((doc) => this.toEntity(doc));
  }

  async findById(id: string): Promise<ITreasuryMovement | null> {
    const doc = await TreasuryMovement.findOne({ _id: id });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async delete(id: string): Promise<void> {
    await TreasuryMovement.deleteOne({ _id: id });
  }

  async deleteByTreasuryId(treasuryId: string): Promise<void> {
    await TreasuryMovement.deleteMany({ treasuryId });
  }
}
