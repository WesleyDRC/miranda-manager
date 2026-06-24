import { inject, injectable } from "tsyringe";

import { IUseCase } from "@/modules/treasury/useCases/ports/IUseCase";
import { ITreasuryInvestmentRepository } from "@/modules/treasury/repositories/ITreasuryInvestmentRepository";
import { ITreasurySnapshotRepository } from "@/modules/treasury/repositories/ITreasurySnapshotRepository";
import { ITreasurySnapshot } from "@/modules/treasury/entities/ITreasurySnapshot";
import { TreasuryCalculationService } from "@/modules/treasury/services/TreasuryCalculationService";
import { AppError } from "@/shared/errors/AppError";
import { treasuryConstants } from "@/modules/treasury/constants/treasuryConstants";

interface IRequest {
  treasuryId: string;
  userId: string;
  snapshotDate?: Date | string;
}

@injectable()
export class CreateSnapshotUseCase implements IUseCase {
  constructor(
    @inject("TreasuryInvestmentRepository")
    private treasuryInvestmentRepository: ITreasuryInvestmentRepository,
    @inject("TreasurySnapshotRepository")
    private treasurySnapshotRepository: ITreasurySnapshotRepository
  ) {}

  async execute({ treasuryId, userId, snapshotDate }: IRequest): Promise<ITreasurySnapshot> {
    const investment = await this.treasuryInvestmentRepository.findById(treasuryId);

    if (!investment) {
      throw new AppError(treasuryConstants.NOT_FOUND, 404);
    }

    if (investment.userId !== userId) {
      throw new AppError("Não autorizado.", 401);
    }

    const referenceDate = snapshotDate ? new Date(snapshotDate) : new Date();

    const currentValue = TreasuryCalculationService.calculateCurrentValue(
      investment.investedAmount,
      investment.annualRate,
      investment.purchaseDate,
      referenceDate,
      investment.treasuryType
    );

    const projectedValue = TreasuryCalculationService.calculateProjectedValue(
      investment.investedAmount,
      investment.annualRate,
      investment.purchaseDate,
      investment.maturityDate,
      investment.treasuryType
    );

    let marketValue: number | undefined = investment.marketValue;
    if (investment.quantity && investment.marketUnitPrice) {
      marketValue = investment.quantity * investment.marketUnitPrice;
    }

    const snapshot = await this.treasurySnapshotRepository.create({
      treasuryId,
      snapshotDate: referenceDate,
      currentValue,
      projectedValue,
    });

    // Also update the investment's values
    await this.treasuryInvestmentRepository.update(investment.id, {
      currentValue,
      projectedValue,
      marketValue,
    });

    return snapshot;
  }
}
