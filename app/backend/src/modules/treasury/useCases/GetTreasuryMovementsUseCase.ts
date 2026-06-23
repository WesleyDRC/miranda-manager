import { inject, injectable } from "tsyringe";
import { IUseCase } from "@/modules/treasury/useCases/ports/IUseCase";
import { ITreasuryMovementRepository } from "@/modules/treasury/repositories/ITreasuryMovementRepository";
import { ITreasuryMovement } from "@/modules/treasury/entities/ITreasuryMovement";

@injectable()
export class GetTreasuryMovementsUseCase implements IUseCase {
  constructor(
    @inject("TreasuryMovementRepository")
    private treasuryMovementRepository: ITreasuryMovementRepository
  ) {}

  async execute(treasuryId: string): Promise<ITreasuryMovement[]> {
    return this.treasuryMovementRepository.findByTreasuryId(treasuryId);
  }
}
