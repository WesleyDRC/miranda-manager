import { inject, injectable } from "tsyringe";

import { IUseCase } from "@/modules/treasury/useCases/ports/IUseCase";
import { ITreasuryInvestmentRepository } from "@/modules/treasury/repositories/ITreasuryInvestmentRepository";
import { ITreasuryInvestment } from "@/modules/treasury/entities/ITreasuryInvestment";
import { TaxCalculationService } from "@/modules/treasury/services/TaxCalculationService";
import { AppError } from "@/shared/errors/AppError";
import { treasuryConstants } from "@/modules/treasury/constants/treasuryConstants";

interface IRequest {
  id: string;
  userId: string;
}

@injectable()
export class GetTreasuryUseCase implements IUseCase {
  constructor(
    @inject("TreasuryInvestmentRepository")
    private treasuryInvestmentRepository: ITreasuryInvestmentRepository,
    @inject("TaxCalculationService")
    private taxCalculationService: TaxCalculationService
  ) {}

  async execute({ id, userId }: IRequest): Promise<ITreasuryInvestment> {
    const investment = await this.treasuryInvestmentRepository.findById(id);

    if (!investment) {
      throw new AppError(treasuryConstants.NOT_FOUND, 404);
    }

    if (investment.userId !== userId) {
      throw new AppError("Não autorizado.", 401);
    }

    const taxes = this.taxCalculationService.execute(
      investment.investedAmount,
      investment.marketValue || investment.currentValue,
      investment.purchaseDate,
      investment.treasuryType
    );

    return {
      ...investment,
      taxes
    } as any;
  }
}
