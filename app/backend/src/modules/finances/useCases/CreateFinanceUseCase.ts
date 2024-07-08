import { inject, injectable } from "tsyringe";

import { IStoreFinanceDTO } from "../dtos/IStoreFinanceDTO";
import { IUseCase } from "./ports/IUseCase";
import { IFinanceRepository } from "../repositories/IFinanceRepository";
import { IRentRepository } from "../../rent/repositories/IRentRepository";
import { ICategoryRepository } from "../../category/repositories/ICategoryRepository";
import { IFinance } from "../entities/IFinance";

import { financeConstants } from "../contants/financeContants";
import { AppError } from "../../../shared/errors/AppError";

@injectable()
export class CreateFinanceUseCase implements IUseCase {
	constructor(
		@inject("FinanceRepository")
		private financeRepository: IFinanceRepository,

		@inject("CategoryRepository")
		private categoryRepository: ICategoryRepository,

		@inject("RentRepository")
		private rentRepository: IRentRepository

	){}
	async execute({name, categoryId, rentId, userId}: IStoreFinanceDTO): Promise<IFinance> {
		
		const financeFound = await this.financeRepository.findByName(name)

		if(financeFound){
			throw new AppError(financeConstants.ALREADY_EXISTS, 409)
		}

		//const categoryFound = await this.categoryRepository.find

		const financeCreated = await this.financeRepository.create({
			name,
			categoryId,
			rentId,
			userId
		})

		return financeCreated
	}
}