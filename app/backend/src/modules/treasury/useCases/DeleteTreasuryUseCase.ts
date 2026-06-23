import { inject, injectable } from "tsyringe";

import { IUseCase } from "@/modules/treasury/useCases/ports/IUseCase";
import { ITreasuryInvestmentRepository } from "@/modules/treasury/repositories/ITreasuryInvestmentRepository";
import { ITreasuryMovementRepository } from "@/modules/treasury/repositories/ITreasuryMovementRepository";
import { ITreasurySnapshotRepository } from "@/modules/treasury/repositories/ITreasurySnapshotRepository";
import { AppError } from "@/shared/errors/AppError";
import { treasuryConstants } from "@/modules/treasury/constants/treasuryConstants";

interface IRequest {
  id: string;
  userId: string;
}

@injectable()
export class DeleteTreasuryUseCase implements IUseCase {
  constructor(
    @inject("TreasuryInvestmentRepository")
    private treasuryInvestmentRepository: ITreasuryInvestmentRepository,
    @inject("TreasuryMovementRepository")
    private treasuryMovementRepository: ITreasuryMovementRepository,
    @inject("TreasurySnapshotRepository")
    private treasurySnapshotRepository: ITreasurySnapshotRepository
  ) {}

  async execute({ id, userId }: IRequest): Promise<void> {
    const existing = await this.treasuryInvestmentRepository.findById(id);

    if (!existing) {
      throw new AppError(treasuryConstants.NOT_FOUND, 404);
    }

    if (existing.userId !== userId) {
      throw new AppError("Não autorizado.", 401);
    }

    // Clean up related data
    await this.treasuryMovementRepository.deleteByTreasuryId(id);
    await this.treasurySnapshotRepository.deleteByTreasuryId(id);
    await this.treasuryInvestmentRepository.delete(id);
  }
}
