import {IStoreRentDTO} from "../dtos/IStoreRentDTO"
import { IStoreRentMonthDTO } from "../dtos/IStoreRentMonthDTO"

import { IRent } from "../entities/IRent"
import { IRentMonth } from "../entities/IRentMonth"

export interface IRentRepository {
	create(rent: IStoreRentDTO): Promise<IRent>
	createRentMonth(rentMonth: IStoreRentMonthDTO): Promise<IRentMonth>
}