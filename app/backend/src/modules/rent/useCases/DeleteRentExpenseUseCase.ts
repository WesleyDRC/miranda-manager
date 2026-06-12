import { injectable, inject } from "tsyringe";
import { IRentRepository } from "@/modules/rent/repositories/IRentRepository";
import { IUseCase } from "@/modules/rent/useCases/ports/IUseCase";

import { rentConstants } from "@/modules/rent/contants/rentConstants";

import { AppError } from "@/shared/errors/AppError";

@injectable()
export class DeleteRentExpenseUseCase implements IUseCase {
  constructor(
    @inject("RentRepository")
    private rentRepository: IRentRepository
  ) {}

  async execute({ rentExpenseId, userId }): Promise<boolean> {
    const existingRentExpense = await this.rentRepository.findRentExpenseById(
      rentExpenseId,
      userId
    );

    if (!existingRentExpense) {
      throw new AppError(rentConstants.RENT_EXPENSE_NOT_FOUND, 404);
    }

    const wasDeleted = await this.rentRepository.deleteRentExpense(
      rentExpenseId,
      userId
    );

    return wasDeleted;
  }
}
