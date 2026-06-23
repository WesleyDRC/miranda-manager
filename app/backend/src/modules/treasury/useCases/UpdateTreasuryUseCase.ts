import { inject, injectable } from "tsyringe";

import { IUseCase } from "@/modules/treasury/useCases/ports/IUseCase";
import { ITreasuryInvestmentRepository } from "@/modules/treasury/repositories/ITreasuryInvestmentRepository";
import { ITreasuryInvestment } from "@/modules/treasury/entities/ITreasuryInvestment";
import { TreasuryCalculationService } from "@/modules/treasury/services/TreasuryCalculationService";
import { AppError } from "@/shared/errors/AppError";
import { treasuryConstants } from "@/modules/treasury/constants/treasuryConstants";

interface IRequest {
  id: string;
  userId: string;
  titleName?: string;
  annualRate?: number;
  maturityDate?: Date | string;
  liquidityAvailable?: boolean;
  notes?: string;
  marketUnitPrice?: number;
}

@injectable()
export class UpdateTreasuryUseCase implements IUseCase {
  constructor(
    @inject("TreasuryInvestmentRepository")
    private treasuryInvestmentRepository: ITreasuryInvestmentRepository
  ) {}

  async execute({ id, userId, ...data }: IRequest): Promise<ITreasuryInvestment> {
    const existing = await this.treasuryInvestmentRepository.findById(id);

    if (!existing) {
      throw new AppError(treasuryConstants.NOT_FOUND, 404);
    }

    if (existing.userId !== userId) {
      throw new AppError("Não autorizado.", 401);
    }

    const updates: Partial<ITreasuryInvestment> = {};

    if (data.titleName !== undefined) updates.titleName = data.titleName;
    if (data.liquidityAvailable !== undefined) updates.liquidityAvailable = data.liquidityAvailable;
    if (data.notes !== undefined) updates.notes = data.notes;

    // Recalculate if rate or maturity changed
    const annualRate = data.annualRate ?? existing.annualRate;
    const maturityDate = data.maturityDate ? new Date(data.maturityDate) : existing.maturityDate;

    if (data.annualRate !== undefined || data.maturityDate !== undefined) {
      updates.annualRate = annualRate;
      updates.maturityDate = maturityDate;
      updates.monthlyEstimatedRate = TreasuryCalculationService.annualToMonthlyRate(annualRate);
      updates.currentValue = TreasuryCalculationService.calculateCurrentValue(
        existing.investedAmount,
        annualRate,
        existing.purchaseDate
      );
      updates.projectedValue = TreasuryCalculationService.calculateProjectedValue(
        existing.investedAmount,
        annualRate,
        existing.purchaseDate,
        maturityDate
      );
    }

    if (data.marketUnitPrice !== undefined) {
      updates.marketUnitPrice = data.marketUnitPrice;
      
      let qty = existing.quantity;
      if (!qty && existing.unitPrice && existing.unitPrice > 0) {
        qty = existing.investedAmount / existing.unitPrice;
      }

      if (qty) {
        updates.marketValue = qty * data.marketUnitPrice;
      } else {
        // Fallback if quantity cannot be inferred
        updates.marketValue = updates.currentValue || existing.currentValue;
      }
    }

    const updated = await this.treasuryInvestmentRepository.update(id, updates);
    return updated;
  }
}
