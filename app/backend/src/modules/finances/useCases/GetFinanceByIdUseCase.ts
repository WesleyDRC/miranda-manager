import { inject, injectable } from "tsyringe";

import { IUseCase } from "@/modules/finances/useCases/ports/IUseCase";
import { IFinance } from "@/modules/finances/entities/IFinance";
import { IFinanceRepository } from "@/modules/finances/repositories/IFinanceRepository";

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