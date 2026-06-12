import { IStoreRentDTO } from "@/modules/rent/dtos/IStoreRentDTO";
import { IRent } from "@/modules/rent/entities/IRent";
import { IRentRepository } from "@/modules/rent/repositories/IRentRepository";
import { IUseCase } from "@/modules/rent/useCases/ports/IUseCase";

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