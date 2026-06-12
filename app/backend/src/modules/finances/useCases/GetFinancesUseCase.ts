import { inject, injectable } from "tsyringe";

import { IUseCase } from "@/modules/finances/useCases/ports/IUseCase";
import { IFinanceRepository } from "@/modules/finances/repositories/IFinanceRepository";
import { IFinance } from "@/modules/finances/entities/IFinance";

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