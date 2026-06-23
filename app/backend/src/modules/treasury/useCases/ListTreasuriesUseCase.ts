import { inject, injectable } from "tsyringe";

import { IUseCase } from "@/modules/treasury/useCases/ports/IUseCase";
import { ITreasuryInvestmentRepository } from "@/modules/treasury/repositories/ITreasuryInvestmentRepository";
import { ITreasuryInvestment } from "@/modules/treasury/entities/ITreasuryInvestment";
import { TaxCalculationService } from "@/modules/treasury/services/TaxCalculationService";

@injectable()
export class ListTreasuriesUseCase implements IUseCase {
  constructor(
    @inject("TreasuryInvestmentRepository")
    private treasuryInvestmentRepository: ITreasuryInvestmentRepository,
    @inject("TaxCalculationService")
    private taxCalculationService: TaxCalculationService
  ) {}

  async execute(userId: string): Promise<ITreasuryInvestment[]> {
    const investments = await this.treasuryInvestmentRepository.findByUserId(userId);
    return investments.map(inv => {
      const taxes = this.taxCalculationService.execute(
        inv.investedAmount,
        inv.marketValue || inv.currentValue,
        inv.purchaseDate,
        inv.treasuryType
      );
      return {
        ...inv,
        taxes
      };
    });
  }
}
