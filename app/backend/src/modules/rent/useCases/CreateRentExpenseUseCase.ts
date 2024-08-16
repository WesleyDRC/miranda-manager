import { IStoreRentExpenseDTO } from "../dtos/IStoreRentExpenseDTO";
import { IRentExpense } from "../entities/IRentExpense";
import { IRentRepository } from "../repositories/IRentRepository";
import { IUseCase } from "./ports/IUseCase";

import { rentConstants } from "../contants/rentConstants";

import { AppError } from "../../../shared/errors/AppError";

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