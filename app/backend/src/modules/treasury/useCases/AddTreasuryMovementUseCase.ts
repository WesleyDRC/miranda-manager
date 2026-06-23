import { inject, injectable } from "tsyringe";

import { IUseCase } from "@/modules/treasury/useCases/ports/IUseCase";
import { ITreasuryInvestmentRepository } from "@/modules/treasury/repositories/ITreasuryInvestmentRepository";
import { ITreasuryMovementRepository } from "@/modules/treasury/repositories/ITreasuryMovementRepository";
import { ICreateTreasuryMovementDTO } from "@/modules/treasury/dtos/ICreateTreasuryMovementDTO";
import { ITreasuryMovement } from "@/modules/treasury/entities/ITreasuryMovement";
import { TreasuryCalculationService } from "@/modules/treasury/services/TreasuryCalculationService";
import { AppError } from "@/shared/errors/AppError";
import { treasuryConstants } from "@/modules/treasury/constants/treasuryConstants";

interface IRequest extends ICreateTreasuryMovementDTO {
  userId: string;
}

@injectable()
export class AddTreasuryMovementUseCase implements IUseCase {
  constructor(
    @inject("TreasuryInvestmentRepository")
    private treasuryInvestmentRepository: ITreasuryInvestmentRepository,
    @inject("TreasuryMovementRepository")
    private treasuryMovementRepository: ITreasuryMovementRepository
  ) {}

  async execute({ userId, ...data }: IRequest): Promise<ITreasuryMovement> {
    const investment = await this.treasuryInvestmentRepository.findById(data.treasuryId);

    if (!investment) {
      throw new AppError(treasuryConstants.NOT_FOUND, 404);
    }

    if (investment.userId !== userId) {
      throw new AppError("Não autorizado.", 401);
    }

    if (data.amount <= 0) {
      throw new AppError(treasuryConstants.INVALID_MOVEMENT_AMOUNT, 400);
    }

    // For withdrawals, check if there's enough current value
    if (data.movementType === "WITHDRAW" && data.amount > investment.currentValue) {
      throw new AppError(treasuryConstants.INSUFFICIENT_BALANCE, 400);
    }

    const movement = await this.treasuryMovementRepository.create(data);

    // Update investment values based on movement
    let newInvestedAmount = investment.investedAmount;
    if (data.movementType === "DEPOSIT") {
      newInvestedAmount += data.amount;
    } else if (data.movementType === "WITHDRAW") {
      newInvestedAmount -= data.amount;
    }
    // ADJUSTMENT does not change investedAmount

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

    return movement;
  }
}
