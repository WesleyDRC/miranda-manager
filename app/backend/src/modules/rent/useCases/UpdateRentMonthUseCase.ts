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

  async execute({ rentMonthId, userId, rentId, updates }) {
    const rentFound = await this.rentRepository.findById({
      id: rentId,
      userId,
    });

    if (!rentFound) {
      throw new AppError(rentConstants.NOT_FOUND, 404);
    }

    const rentMonthFound = await this.rentRepository.findRentMonthById({
      id: rentMonthId,
    });

    if (!rentMonthFound) {
      throw new AppError(rentConstants.RENT_MONTH_NOT_FOUND, 404);
    }

    if(updates.dateMonth) {
      throw new AppError(rentConstants.CANNOT_CHANGE_RENT_MONTH, 403)
    }

    return await this.rentRepository.updateRentMonth(
      rentMonthId,
      rentId,
      updates
    );
  }
}
