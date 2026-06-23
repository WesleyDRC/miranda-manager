import { ITreasuryInvestmentRepository } from "@/modules/treasury/repositories/ITreasuryInvestmentRepository";
import { ICreateTreasuryInvestmentDTO } from "@/modules/treasury/dtos/ICreateTreasuryInvestmentDTO";
import { ITreasuryInvestment } from "@/modules/treasury/entities/ITreasuryInvestment";
import { TreasuryInvestment } from "@/modules/treasury/infra/mongoose/entities/TreasuryInvestment";
import { AppError } from "@/shared/errors/AppError";
import { treasuryConstants } from "@/modules/treasury/constants/treasuryConstants";

export class TreasuryInvestmentRepository implements ITreasuryInvestmentRepository {
  private toEntity(doc: any): ITreasuryInvestment {
    return {
      id: doc._id,
      userId: doc.userId,
      treasuryType: doc.treasuryType,
      titleName: doc.titleName,
      purchaseDate: doc.purchaseDate,
      maturityDate: doc.maturityDate,
      investedAmount: doc.investedAmount,
      currentValue: doc.currentValue,
      projectedValue: doc.projectedValue,
      annualRate: doc.annualRate,
      monthlyEstimatedRate: doc.monthlyEstimatedRate,
      liquidityAvailable: doc.liquidityAvailable,
      quantity: doc.quantity,
      unitPrice: doc.unitPrice,
      marketUnitPrice: doc.marketUnitPrice,
      marketValue: doc.marketValue,
      notes: doc.notes,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async create(
    data: ICreateTreasuryInvestmentDTO & {
      currentValue: number;
      projectedValue: number;
      monthlyEstimatedRate: number;
      marketValue?: number;
    }
  ): Promise<ITreasuryInvestment> {
    const created = await TreasuryInvestment.create(data);
    return this.toEntity(created);
  }

  async findByUserId(userId: string): Promise<ITreasuryInvestment[]> {
    const docs = await TreasuryInvestment.find({ userId });
    return docs.map((doc) => this.toEntity(doc));
  }

  async findById(id: string): Promise<ITreasuryInvestment | null> {
    const doc = await TreasuryInvestment.findOne({ _id: id });
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async update(id: string, data: Partial<ITreasuryInvestment>): Promise<ITreasuryInvestment> {
    const updated = await TreasuryInvestment.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );

    if (!updated) {
      throw new AppError(treasuryConstants.NOT_FOUND, 404);
    }

    return this.toEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await TreasuryInvestment.deleteOne({ _id: id });
  }
}
