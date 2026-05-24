import { inject, injectable } from "tsyringe";
import { AppError } from "../../../shared/errors/AppError";
import { IRentRepository } from "../repositories/IRentRepository";
import { IUseCase } from "./ports/IUseCase";
import { rentConstants } from "../contants/rentConstants";

@injectable()
export class DeleteRentPaymentUseCase implements IUseCase {
  constructor(
    @inject("RentRepository")
    private rentRepository: IRentRepository
  ) {}

  async execute({ id, userId }: { id: string; userId: string }): Promise<void> {
    const deleted = await this.rentRepository.deleteRentPayment(id, userId);

    if (!deleted) {
      throw new AppError("Falha ao deletar pagamento ou pagamento não encontrado", 400);
    }
  }
}
