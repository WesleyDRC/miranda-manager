import { inject, injectable } from "tsyringe";

import { IUseCase } from "./ports/IUseCase";
import { IRentRepository } from "../repositories/IRentRepository";
import { IRent } from "../entities/IRent";

import { rentConstants } from "../contants/rentConstants";

import { AppError } from "../../../shared/errors/AppError";

@injectable()
export class GetRentByIdUseCase implements IUseCase {
  constructor(
    @inject("RentRepository")
    private rentRepository: IRentRepository
  ) {}

  async execute({ id, userId }): Promise<IRent> {
    const rent = await this.rentRepository.findById(id, userId);

		if(!rent) {
			throw new AppError(rentConstants.NOT_FOUND, 404)
		}

    return rent;
  }
}
