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
			categoryId: financeCreated.categoryId.id,
			rentId: financeCreated.rentId.id,
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
			categoryId: financeFound.categoryId.id,
			rentId: financeFound.rentId.id,
			userId: financeFound.userId
		}

		return finance
	}

	async findAll(userId: string): Promise<IFinance[] | []> {

		const financesFound = await Finance.find({ userId }).populate("rentId").populate("categoryId")

		let finances= [];

		financesFound.forEach((financeFound) => {
			finances.push({
				id: financeFound._id,
				name: financeFound.name,
				category: {
					id: financeFound.categoryId.id,
					name: financeFound.categoryId.name}
				,
				rent: {
					id: financeFound.rentId.id,
					name: financeFound.rentId.name,
					value: financeFound.rentId.value,
					street: financeFound.rentId.street,
					streetNumber: financeFound.rentId.streetNumber,
					startRental: financeFound.rentId.startRental,
					grossIncome: financeFound.rentId.grossIncome,
					netIncome: financeFound.rentId.netIncome,
					userId: financeFound.rentId.userId
				},
				userId: financeFound.userId
			})
		})

		return finances
	}

	async findById(id: string, userId: string): Promise<IFinance | null> {
		const financeFound = await Finance.findOne({
			_id: id,
			userId
		}).populate("rentId").populate("categoryId")

		if(!financeFound) {
			return null
		}

		const finance: IFinance = {
			id: financeFound._id,
			name: financeFound.name,
			category: {
				id: financeFound.categoryId.id,
				name: financeFound.categoryId.name}
			,
			rent: {
				name: financeFound.rentId.name,
				value: financeFound.rentId.value,
				street: financeFound.rentId.street,
				streetNumber: financeFound.rentId.streetNumber,
				startRental: financeFound.rentId.startRental,
				grossIncome: financeFound.rentId.grossIncome,
				netIncome: financeFound.rentId.netIncome,
				userId: financeFound.rentId.userId
			},
			userId: financeFound.userId
		}

		return finance
  }
}
