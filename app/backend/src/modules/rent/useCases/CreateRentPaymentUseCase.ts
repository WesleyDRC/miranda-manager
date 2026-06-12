import { inject, injectable } from "tsyringe";
import { AppError } from "@/shared/errors/AppError";
import { IRentRepository } from "@/modules/rent/repositories/IRentRepository";
import { IUseCase } from "@/modules/rent/useCases/ports/IUseCase";
import { rentConstants } from "@/modules/rent/contants/rentConstants";

@injectable()
export class CreateRentPaymentUseCase implements IUseCase {
  constructor(
    @inject("RentRepository")
    private rentRepository: IRentRepository
  ) {}

  async execute({ amount, paymentDate, rentMonthId, userId }: any): Promise<any> {
    if (!amount || !paymentDate || !rentMonthId || !userId) {
      throw new AppError("Campos obrigatórios faltando", 400);
    }

    const rentMonth = await this.rentRepository.findRentMonthById({ id: rentMonthId });

    if (!rentMonth) {
      throw new AppError(rentConstants.NOT_FOUND, 404);
    }

    const paymentCreated = await this.rentRepository.createRentPayment({
      amount,
      paymentDate,
      rentMonthId,
      userId,
    });

    return paymentCreated;
  }
}
