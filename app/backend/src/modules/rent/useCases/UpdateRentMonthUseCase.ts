import { injectable, inject } from "tsyringe";
import { IRentRepository } from "../repositories/IRentRepository";
import { IUseCase } from "./ports/IUseCase";

import { rentConstants } from "../contants/rentConstants";

import { AppError } from "../../../shared/errors/AppError";

@injectable()
export class UpdateRentMonthUseCase implements IUseCase {
  constructor(
    @inject("RentRepository")
    private rentRepository: IRentRepository
  ) {}

  async execute({
    rentMonthid,
    userId,
    rentId, 
    updates
  }) {
    const rentFound = await this.rentRepository.findById({id: rentId, userId});

		if(!rentFound) {
			throw new AppError(rentConstants.NOT_FOUND, 404)
		}

    return await this.rentRepository.updateRentMonth(
      rentMonthid, rentId, updates
    );
  }
}
