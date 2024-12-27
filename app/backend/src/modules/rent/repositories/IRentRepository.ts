import { IStoreRentDTO } from "../dtos/IStoreRentDTO";
import { IStoreRentMonthDTO } from "../dtos/IStoreRentMonthDTO";
import { IStoreRentExpenseDTO } from "../dtos/IStoreRentExpenseDTO";
import { IStoreRentReceiptDTO } from "../dtos/IStoreRentReceiptDTO";

import { IRentExpense } from "../entities/IRentExpense";
import { IRent } from "../entities/IRent";
import { IRentMonth } from "../entities/IRentMonth";
import { IRentReceipt } from "../entities/IRentReceipt";

export interface IRentRepository {
  create(rent: IStoreRentDTO): Promise<IRent>;

  createRentMonth(rentMonth: IStoreRentMonthDTO): Promise<IRentMonth>;

  findById({ id, userId }): Promise<IRent>;

  findRentMonthById({ id }): Promise<IRentMonth>;

  findAllRentMonthByRentId(rentId: string): Promise<IRentMonth[]>;

  updateRentMonth(
    rentMonthId: string,
    rentId: string,
    updates: any
  ): Promise<IRentMonth>;

  createRentExpense(rentExpense: IStoreRentExpenseDTO): Promise<IRentExpense>;

  findRentExpenses(rentMonthId: string): Promise<IRentExpense[]>;

  findRentExpenseById(
    rentExpenseId: string,
    userId: string
  ): Promise<IRentExpense | null>;

  updateRentExpense(
    rentExpenseId: string,
    userId: string,
    updates: any
  ): Promise<IRentExpense>;

  deleteRentExpense(rentExpenseId: string, userId: string): Promise<boolean>;

  createRentReceipt(rentReceipt: IStoreRentReceiptDTO): Promise<IRentReceipt>

  findRentReceipts(rentMonthId: string): Promise<IRentReceipt[]>
}
