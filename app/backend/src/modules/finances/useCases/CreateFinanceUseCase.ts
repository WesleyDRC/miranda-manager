import { inject, injectable } from "tsyringe";

import { IStoreFinanceDTO } from "../dtos/IStoreFinanceDTO";
import { IUseCase } from "./ports/IUseCase";
import { IFinanceRepository } from "../repositories/IFinanceRepository";
import { IFinance } from "../entities/IFinance";

import { financeConstants } from "../contants/financeContants";
import { AppError } from "../../../shared/errors/AppError";

@injectable()
export class CreateFinanceUseCase implements IUseCase {
	constructor(
		@inject("FinanceRepository")
		private financeRepository: IFinanceRepository
	){}
	async execute({name, categoryId, rentId, userId}: IStoreFinanceDTO): Promise<IFinance> {
		
		const financeFound = await this.financeRepository.findByName(name)

		if(financeFound){
			throw new AppError(financeConstants.ALREADY_EXISTS, 409)
		}

		const financeCreated = await this.financeRepository.create({
			name,
			categoryId,
			rentId,
			userId
		})

		return financeCreated
	}
}