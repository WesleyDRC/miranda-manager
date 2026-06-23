import { inject, injectable } from "tsyringe";

import { IUseCase } from "@/modules/treasury/useCases/ports/IUseCase";
import { ITreasuryInvestmentRepository } from "@/modules/treasury/repositories/ITreasuryInvestmentRepository";
import { ICreateTreasuryInvestmentDTO } from "@/modules/treasury/dtos/ICreateTreasuryInvestmentDTO";
import { ITreasuryInvestment } from "@/modules/treasury/entities/ITreasuryInvestment";
import { TreasuryCalculationService } from "@/modules/treasury/services/TreasuryCalculationService";

@injectable()
export class CreateTreasuryUseCase implements IUseCase {
  constructor(
    @inject("TreasuryInvestmentRepository")
    private treasuryInvestmentRepository: ITreasuryInvestmentRepository
  ) {}

  async execute(data: ICreateTreasuryInvestmentDTO): Promise<ITreasuryInvestment> {
    const purchaseDate = new Date(data.purchaseDate);
    const maturityDate = new Date(data.maturityDate);

    const monthlyEstimatedRate = TreasuryCalculationService.annualToMonthlyRate(data.annualRate);

    const currentValue = TreasuryCalculationService.calculateCurrentValue(
      data.investedAmount,
      data.annualRate,
      purchaseDate
    );

    const projectedValue = TreasuryCalculationService.calculateProjectedValue(
      data.investedAmount,
      data.annualRate,
      purchaseDate,
      maturityDate
    );

    let marketValue: number | undefined = undefined;
    if (data.quantity && data.marketUnitPrice) {
      marketValue = data.quantity * data.marketUnitPrice;
    }

    const investment = await this.treasuryInvestmentRepository.create({
      ...data,
      purchaseDate,
      maturityDate,
      currentValue,
      projectedValue,
      marketValue,
      monthlyEstimatedRate,
      liquidityAvailable: data.liquidityAvailable ?? true,
    });

    return investment;
  }
}
