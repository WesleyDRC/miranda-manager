import { IStoreRentExpenseDTO } from "../dtos/IStoreRentExpenseDTO";
import { IRentExpense } from "../models/RentExpense";

export interface IRentExpenseRepository {
  create(rentExpense: IStoreRentExpenseDTO): Promise<IRentExpense>;
}
