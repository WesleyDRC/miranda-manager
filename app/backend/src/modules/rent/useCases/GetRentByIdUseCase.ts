import { inject, injectable } from "tsyringe";

import { IUseCase } from "./ports/IUseCase";
import { IRentRepository } from "../repositories/IRentRepository";
import { IRent } from "../entities/IRent";

import { rentConstants } from "../contants/rentConstants";

import { formatDateToDDMMYY } from "../../../shared/utils/formatDateToDDMMYY";

import { AppError } from "../../../shared/errors/AppError";

@injectable()
export class GetRentByIdUseCase implements IUseCase {
  constructor(
    @inject("RentRepository")
    private rentRepository: IRentRepository
  ) {}

  async execute({ id, userId }): Promise<IRent> {
    const rent = await this.rentRepository.findById({ id, userId });

    if (!rent) {
      throw new AppError(rentConstants.NOT_FOUND, 404);
    }

    const rentMonths = await this.rentRepository.findAllRentMonthByRentId(id);

    const months = await Promise.all(
      rentMonths.map(async (month) => {
        const rentExpenses = await this.rentRepository.findRentExpenses(
          month.id
        );

        return {
          id: month.id,
          dateMonth: formatDateToDDMMYY(month.dateMonth),
          amountPaid: month.amountPaid,
          paid: month.paid,
          receipt: month.receipt,
          expenses: rentExpenses,
        };
      })
    );

    rent.months = months;

    return rent;
  }
}
