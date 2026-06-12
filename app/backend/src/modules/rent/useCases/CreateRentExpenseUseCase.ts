import { IStoreRentExpenseDTO } from "@/modules/rent/dtos/IStoreRentExpenseDTO";
import { IRentExpense } from "@/modules/rent/entities/IRentExpense";
import { IRentRepository } from "@/modules/rent/repositories/IRentRepository";
import { IUseCase } from "@/modules/rent/useCases/ports/IUseCase";

import { rentConstants } from "@/modules/rent/contants/rentConstants";

import { AppError } from "@/shared/errors/AppError";

import { inject, injectable } from "tsyringe";

@injectable()
export class CreateRentExpenseUseCase implements IUseCase {
	constructor(
		@inject("RentRepository")
		private rentRepository: IRentRepository
	){}
	async execute({
		amount,
		reason,
		rentMonthId,
		userId
	}: IStoreRentExpenseDTO ): Promise<IRentExpense> {

    const rentMonth = await this.rentRepository.findRentMonthById({ id: rentMonthId });

		if(!rentMonth) {
			throw new AppError(rentConstants.RENT_MONTH_NOT_FOUND, 404)
		}

		const rentExpense = await this.rentRepository.createRentExpense({
			amount,
			reason,
			rentMonthId: rentMonth.id,
			userId
		})

		return rentExpense
	}
}