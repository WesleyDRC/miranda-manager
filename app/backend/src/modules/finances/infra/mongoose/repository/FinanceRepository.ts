import { IFinanceRepository } from "../../../repositories/IFinanceRepository";
import { IStoreFinanceDTO } from "../../../dtos/IStoreFinanceDTO";
import { IFinance } from "../../../entities/IFinance";

import { Finance } from "../entities/Finance";

export class FinanceRepository implements IFinanceRepository {
	async create({name, categoryId, rentId, userId}: IStoreFinanceDTO): Promise<IFinance> {

		const financeCreated = await Finance.create({
			name,
			categoryId,
			rentId,
			userId
		})

		const finance: IFinance = {
			id: financeCreated._id,
			name: financeCreated.name,
			categoryId: financeCreated.categoryId,
			rentId: financeCreated.rentId,
			userId: financeCreated.userId
		}

		return finance
	}

	async findByName(name: string): Promise<IFinance | null>{
		const financeFound = await Finance.findOne({
			name
		})

		if(!financeFound) {
			return null
		}

		const finance: IFinance = {
			id: financeFound._id,
			name: financeFound.name,
			categoryId: financeFound.categoryId,
			rentId: financeFound.rentId,
			userId: financeFound.userId
		}

		return finance
	}
}