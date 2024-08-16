import { injectable, inject } from "tsyringe";
import { IRentRepository } from "../repositories/IRentRepository";
import { IUseCase } from "./ports/IUseCase";

import { rentConstants } from "../contants/rentConstants";

import { AppError } from "../../../shared/errors/AppError";
import { IRentExpense } from "../entities/IRentExpense";

@injectable()
export class UpdateRentExpenseUseCase implements IUseCase {
  constructor(
    @inject("RentRepository")
    private rentRepository: IRentRepository
  ) {}

  async execute({ rentExpenseId, userId, updates }): Promise<IRentExpense> {
    const rentExpense = await this.rentRepository.findRentExpenseById(
      rentExpenseId,
      userId
    );

    if (!rentExpense) {
      throw new AppError(rentConstants.RENT_EXPENSE_NOT_FOUND, 404);
    }

    const updatedRentExpense = await this.rentRepository.updateRentExpense(
      rentExpenseId,
      userId,
      updates
    );

    return {
      id: updatedRentExpense.id,
      amount: updatedRentExpense.amount,
      reason: updatedRentExpense.reason,
      rentMonthId: updatedRentExpense.rentMonthId,
      userId: updatedRentExpense.userId,
    };
  }
}
