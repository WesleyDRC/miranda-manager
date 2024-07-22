import {IStoreRentDTO} from "../dtos/IStoreRentDTO"
import { IStoreRentMonthDTO } from "../dtos/IStoreRentMonthDTO"
import { IStoreRentExpenseDTO } from "../dtos/IStoreRentExpenseDTO"
import { IRentExpense } from "../entities/IRentExpense"

import { IRent } from "../entities/IRent"
import { IRentMonth } from "../entities/IRentMonth"

export interface IRentRepository {
	create(rent: IStoreRentDTO): Promise<IRent>
	createRentMonth(rentMonth: IStoreRentMonthDTO): Promise<IRentMonth>
	findById({id, userId}): Promise<IRent>
	findRentMonthById({id}): Promise<IRentMonth>
	findAllRentMonthById(rentId: string,): Promise<IRentMonth[]>
	updateRentMonth(rentMonthid: string, rentId: string, updates): Promise<IRentMonth>
	createRentExpense(rentExpense: IStoreRentExpenseDTO): Promise<IRentExpense>
	findRentExpenses(rentMonthId: string): Promise<IRentExpense[]>
}