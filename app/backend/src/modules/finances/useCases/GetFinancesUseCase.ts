import { inject, injectable } from "tsyringe";

import { IStoreFinanceDTO } from "../dtos/IStoreFinanceDTO";
import { IUseCase } from "./ports/IUseCase";
import { IFinanceRepository } from "../repositories/IFinanceRepository";
import { IRentRepository } from "../../rent/repositories/IRentRepository";
import { ICategoryRepository } from "../../category/repositories/ICategoryRepository";
import { IFinance } from "../entities/IFinance";
import { ICategory } from "../../category/entities/ICategory";

import { financeConstants } from "../contants/financeContants";
import { categoryConstants } from "../../category/contants/categoryContants";

import { AppError } from "../../../shared/errors/AppError";
import { Finance } from "../infra/mongoose/entities/Finance";
import { FinanceRepository } from "../infra/mongoose/repository/FinanceRepository";

@injectable()
export class GetFinancesUseCase implements IUseCase {
	constructor(
		@inject("FinanceRepository")
		private financeRepository: IFinanceRepository,

		@inject("CategoryRepository")
		private categoryRepository: ICategoryRepository,

		@inject("RentRepository")
		private rentRepository: IRentRepository

	){}

	async execute({userId}): Promise<IFinance[]> {

		const finances = await this.financeRepository.findAll(userId)

		return finances
	}
}