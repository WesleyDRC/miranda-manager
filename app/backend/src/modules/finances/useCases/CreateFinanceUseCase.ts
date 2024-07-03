import { inject, injectable } from "tsyringe";

import { IStoreFinanceDTO } from "../dtos/IStoreFinanceDTO";
import { IUseCase } from "./ports/IUseCase";
import { IFinanceRepository } from "../repositories/IFinanceRepository";
import { IFinance } from "../entities/IFinance";

@injectable()
export class CreateFinanceUseCase implements IUseCase {
	constructor(
		@inject("FinanceRepository")
		private financeRepository: IFinanceRepository
	){}
	async execute({name, categoryId, rentId, userId}: IStoreFinanceDTO): Promise<IFinance> {
		
		const financeCreated = await this.financeRepository.create({
			name,
			categoryId,
			rentId,
			userId
		})

		console.log(financeCreated)

		return financeCreated
	}
}