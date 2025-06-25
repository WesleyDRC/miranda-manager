import { IStoreRentMonthDTO } from "../dtos/IStoreRentMonthDTO"
import { IRentMonth } from "../entities/IRentMonth"

export interface IRentMonthRepository {
	findAll(): Promise<IRentMonth[]>
	create(rentMonth: IStoreRentMonthDTO): Promise<IRentMonth>
	findByRentId(rentId: string): Promise<IRentMonth[]>
	findLastMonthByRentId(rentId: string): Promise<IRentMonth | null>
}