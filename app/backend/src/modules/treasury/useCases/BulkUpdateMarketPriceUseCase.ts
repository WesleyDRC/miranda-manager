import { inject, injectable } from "tsyringe";

import { ITreasuryInvestmentRepository } from "@/modules/treasury/repositories/ITreasuryInvestmentRepository";
import { TreasuryCalculationService } from "@/modules/treasury/services/TreasuryCalculationService";
import { AppError } from "@/shared/errors/AppError";

interface IRequest {
  userId: string;
  titleName: string;
  marketUnitPrice: number;
}

@injectable()
export class BulkUpdateMarketPriceUseCase {
  constructor(
    @inject("TreasuryInvestmentRepository")
    private treasuryInvestmentRepository: ITreasuryInvestmentRepository
  ) {}

  async execute({ userId, titleName, marketUnitPrice }: IRequest): Promise<void> {
    const investments = await this.treasuryInvestmentRepository.findByUserId(userId);
    const targetInvestments = investments.filter(inv => inv.titleName === titleName);

    if (targetInvestments.length === 0) {
      throw new AppError("Nenhum título encontrado com este nome.", 404);
    }

    for (const inv of targetInvestments) {
      const updates: any = { marketUnitPrice };
      
      let qty = inv.quantity;
      if (!qty && inv.unitPrice && inv.unitPrice > 0) {
        qty = inv.investedAmount / inv.unitPrice;
      }
      
      if (qty) {
        updates.marketValue = qty * marketUnitPrice;
      } else {
        // Fallback safely to currentValue if quantity can't be inferred
        updates.marketValue = inv.currentValue;
      }
      
      await this.treasuryInvestmentRepository.update(inv.id, updates);
    }
  }
}
