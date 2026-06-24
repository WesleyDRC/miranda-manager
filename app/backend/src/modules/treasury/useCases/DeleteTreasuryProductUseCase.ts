import { inject, injectable } from "tsyringe";
import { ITreasuryProductRepository } from "../repositories/ITreasuryProductRepository";
import { AppError } from "@/shared/errors/AppError";

@injectable()
export class DeleteTreasuryProductUseCase {
  constructor(
    @inject("TreasuryProductRepository")
    private treasuryProductRepository: ITreasuryProductRepository
  ) {}

  async execute(id: string): Promise<void> {
    const product = await this.treasuryProductRepository.findById(id);

    if (!product) {
      throw new AppError("Treasury product not found", 404);
    }

    await this.treasuryProductRepository.delete(id);
  }
}
