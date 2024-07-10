import { IStoreFinanceDTO } from "../dtos/IStoreFinanceDTO";
import { IFinance } from "../entities/IFinance";

export interface IFinanceRepository {
	create(finance: IStoreFinanceDTO): Promise<IFinance>
	findByName(name: string): Promise<IFinance | null>
	findAll(userId: string): Promise<IFinance[] | []>
}