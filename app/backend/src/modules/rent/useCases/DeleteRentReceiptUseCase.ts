import { inject, injectable } from "tsyringe";
import fs from "fs";
import { IRentRepository } from "../repositories/IRentRepository";
import { IUseCase } from "./ports/IUseCase";
import { AppError } from "../../../shared/errors/AppError";

@injectable()
export class DeleteRentReceiptUseCase implements IUseCase {
  constructor(
    @inject("RentRepository")
    private rentRepository: IRentRepository
  ) {}

  async execute({ id }: { id: string }): Promise<void> {
    const rentReceipt = await this.rentRepository.findRentReceiptById(id);

    if (!rentReceipt) {
      throw new AppError("Comprovante não encontrado", 404);
    }

    // Delete file from disk if it exists
    if (rentReceipt.receipt && fs.existsSync(rentReceipt.receipt)) {
      try {
        fs.unlinkSync(rentReceipt.receipt);
      } catch (err) {
        console.error(`Falha ao remover arquivo de comprovante no disco: ${rentReceipt.receipt}`, err);
      }
    }

    const deleted = await this.rentRepository.deleteRentReceipt(id);

    if (!deleted) {
      throw new AppError("Falha ao excluir o registro de comprovante", 400);
    }
  }
}
