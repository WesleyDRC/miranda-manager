import { inject, injectable } from "tsyringe";

import { IUseCase } from "./ports/IUseCase";
import { IRentRepository } from "../repositories/IRentRepository";
import { IRent } from "../entities/IRent";

import { rentConstants } from "../contants/rentConstants";

import { formatDateToMMDDYY } from "../../../shared/utils/formatDateTOMMDDYY";

import { AppError } from "../../../shared/errors/AppError";

@injectable()
export class GetRentByIdUseCase implements IUseCase {
  constructor(
    @inject("RentRepository")
    private rentRepository: IRentRepository
  ) {}

  async execute({ id, userId }): Promise<IRent> {

    await this.rentRepository.updateRentMonth(id, { amountPaid: 1212313 });

    let rent = await this.rentRepository.findById(id, userId);

		if(!rent) {
			throw new AppError(rentConstants.NOT_FOUND, 404)
		}

    const rentMonths = await this.rentRepository.findAllRentMonthById(id)

    const months = rentMonths.map((month) => {
      return {
        dateMonth: formatDateToMMDDYY(month.dateMonth), 
        amountPaid: month.amountPaid,
        paid: month.paid
      };
    });

    rent.months = months

    return rent;
  }
}
