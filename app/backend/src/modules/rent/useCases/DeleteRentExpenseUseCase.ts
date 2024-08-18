import { injectable, inject } from "tsyringe";
import { IRentRepository } from "../repositories/IRentRepository";
import { IUseCase } from "./ports/IUseCase";

import { rentConstants } from "../contants/rentConstants";

import { AppError } from "../../../shared/errors/AppError";

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
