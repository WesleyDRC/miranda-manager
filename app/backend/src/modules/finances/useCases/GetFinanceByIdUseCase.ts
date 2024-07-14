import { inject, injectable } from "tsyringe";

import { IUseCase } from "./ports/IUseCase";
import { IFinance } from "../entities/IFinance";
import { IFinanceRepository } from "../repositories/IFinanceRepository";

@injectable()
export class GetFinanceByIdUseCase implements IUseCase {
	constructor(
		@inject("FinanceRepository")
		private financeRepository: IFinanceRepository
	) {}

	async execute({id, userId}): Promise<IFinance> {
		
		const financeFound = this.financeRepository.findById(id, userId)

		return financeFound
	}
}