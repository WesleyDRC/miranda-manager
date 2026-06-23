import { inject, injectable } from "tsyringe";

import { IUseCase } from "@/modules/treasury/useCases/ports/IUseCase";
import { ITreasuryInvestmentRepository } from "@/modules/treasury/repositories/ITreasuryInvestmentRepository";
import { ITreasuryMovementRepository } from "@/modules/treasury/repositories/ITreasuryMovementRepository";
import { TreasuryCalculationService } from "@/modules/treasury/services/TreasuryCalculationService";
import { AppError } from "@/shared/errors/AppError";
import { treasuryConstants } from "@/modules/treasury/constants/treasuryConstants";

interface IRequest {
  movementId: string;
  userId: string;
}

@injectable()
export class RemoveTreasuryMovementUseCase implements IUseCase {
  constructor(
    @inject("TreasuryInvestmentRepository")
    private treasuryInvestmentRepository: ITreasuryInvestmentRepository,
    @inject("TreasuryMovementRepository")
    private treasuryMovementRepository: ITreasuryMovementRepository
  ) {}

  async execute({ movementId, userId }: IRequest): Promise<void> {
    const movement = await this.treasuryMovementRepository.findById(movementId);

    if (!movement) {
      throw new AppError(treasuryConstants.MOVEMENT_NOT_FOUND, 404);
    }

    const investment = await this.treasuryInvestmentRepository.findById(movement.treasuryId);

    if (!investment) {
      throw new AppError(treasuryConstants.NOT_FOUND, 404);
    }

    if (investment.userId !== userId) {
      throw new AppError("Não autorizado.", 401);
    }

    // Reverse the movement's effect on investedAmount
    let newInvestedAmount = investment.investedAmount;
    if (movement.movementType === "DEPOSIT") {
      newInvestedAmount -= movement.amount;
    } else if (movement.movementType === "WITHDRAW") {
      newInvestedAmount += movement.amount;
    }

    // Prevent negative invested amount
    if (newInvestedAmount < 0) newInvestedAmount = 0;

    await this.treasuryMovementRepository.delete(movementId);

    const currentValue = TreasuryCalculationService.calculateCurrentValue(
      newInvestedAmount,
      investment.annualRate,
      investment.purchaseDate
    );

    const projectedValue = TreasuryCalculationService.calculateProjectedValue(
      newInvestedAmount,
      investment.annualRate,
      investment.purchaseDate,
      investment.maturityDate
    );

    await this.treasuryInvestmentRepository.update(investment.id, {
      investedAmount: newInvestedAmount,
      currentValue,
      projectedValue,
    });
  }
}
