import { inject, injectable } from "tsyringe";
import { IUseCase } from "@/modules/treasury/useCases/ports/IUseCase";
import { ITreasurySnapshotRepository } from "@/modules/treasury/repositories/ITreasurySnapshotRepository";
import { ITreasurySnapshot } from "@/modules/treasury/entities/ITreasurySnapshot";

@injectable()
export class GetTreasurySnapshotsUseCase implements IUseCase {
  constructor(
    @inject("TreasurySnapshotRepository")
    private treasurySnapshotRepository: ITreasurySnapshotRepository
  ) {}

  async execute(treasuryId: string): Promise<ITreasurySnapshot[]> {
    return this.treasurySnapshotRepository.findByTreasuryId(treasuryId);
  }
}
