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
		value,
		reason,
		rentId,
		userId
	}: IStoreRentExpenseDTO ): Promise<IRentExpense> {

    const rent = await this.rentRepository.findById({id: rentId, userId});

		if(!rent) {
			throw new AppError(rentConstants.NOT_FOUND, 404)
		}

		const rentExpense = await this.rentRepository.createRentExpense({
			value,
			reason,
			rentId,
		})

		return rentExpense
	}
}