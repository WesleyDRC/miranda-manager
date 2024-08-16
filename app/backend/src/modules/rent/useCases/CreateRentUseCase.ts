import { IStoreRentDTO } from "../dtos/IStoreRentDTO";
import { IRent } from "../entities/IRent";
import { IRentRepository } from "../repositories/IRentRepository";
import { IUseCase } from "./ports/IUseCase";

import { inject, injectable } from "tsyringe";

@injectable()
export class CreateRentUseCase implements IUseCase {
	constructor(
		@inject("RentRepository")
		private rentRepository: IRentRepository
	){}
	async execute({
		tenant,
		startRental,
		street,
		streetNumber,
		value,
		userId
	}: IStoreRentDTO): Promise<IRent> {

		const rent = await this.rentRepository.create({
			tenant,
			startRental,
			street,
			streetNumber,
			value,
			userId
		})

		return rent
	}
}