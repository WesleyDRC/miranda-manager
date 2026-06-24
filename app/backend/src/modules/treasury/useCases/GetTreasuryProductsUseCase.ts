import { inject, injectable } from "tsyringe";
import { ITreasuryProductRepository } from "../repositories/ITreasuryProductRepository";
import { ITreasuryProductDocument } from "../infra/mongoose/entities/TreasuryProduct";

@injectable()
export class GetTreasuryProductsUseCase {
  constructor(
    @inject("TreasuryProductRepository")
    private treasuryProductRepository: ITreasuryProductRepository
  ) {}

  async execute(userId?: string): Promise<ITreasuryProductDocument[]> {
    return this.treasuryProductRepository.findAll(userId);
  }
}
