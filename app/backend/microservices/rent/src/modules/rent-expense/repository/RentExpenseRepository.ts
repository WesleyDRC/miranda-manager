import { IStoreRentExpenseDTO } from "../dtos/IStoreRentExpenseDTO";
import { IRentExpense, RentExpense } from "../models/RentExpense";
import { IRentExpenseRepository } from "./IRentExpenseRepository";

export class RentExpenseRepository implements IRentExpenseRepository {
  async create(rentExpense: IStoreRentExpenseDTO): Promise<IRentExpense> {
    const rentExpenseCreated = await RentExpense.create({
      amount: rentExpense.amount,
      reason: rentExpense.reason,
      rentMonthId: rentExpense.rentMonthId,
      userId: rentExpense.userId,
    });

    return rentExpenseCreated;
  }
}
