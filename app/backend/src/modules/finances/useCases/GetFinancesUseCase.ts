import { inject, injectable } from "tsyringe";

import { IUseCase } from "./ports/IUseCase";
import { IFinanceRepository } from "../repositories/IFinanceRepository";
import { IFinance } from "../entities/IFinance";

@injectable()
export class GetFinancesUseCase implements IUseCase {
	constructor(
		@inject("FinanceRepository")
		private financeRepository: IFinanceRepository
	){}

	async execute({userId}): Promise<IFinance[]> {

		const finances = await this.financeRepository.findAll(userId)

		return finances
	}
}