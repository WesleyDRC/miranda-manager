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

    const rentValue = parseFloat(rent.value) || 0;
    let totalPaid = 0;

    const months = await Promise.all(
      rentMonths.map(async (month) => {
        const rentExpenses = await this.rentRepository.findRentExpenses(
          month.id
        );
        const rentReceipts = await this.rentRepository.findRentReceipts(
          month.id
        );

        const rentPayments = await this.rentRepository.findRentPayments(
          month.id
        );

        totalPaid += month.amountPaid || 0;

        return {
          id: month.id,
          dateMonth: formatDateToDDMMYY(month.dateMonth),
          amountPaid: month.amountPaid,
          paid: month.paid,
          difference: rentValue - (month.amountPaid || 0),
          receipt: rentReceipts,
          expenses: rentExpenses,
          payments: rentPayments,
        };
      })
    );

    const totalExpected = months.length * rentValue;
    const totalDebt = totalExpected - totalPaid;
    const isDebtFree = totalDebt <= 0;

    rent.months = months;
    rent.totalExpected = totalExpected;
    rent.totalPaid = totalPaid;
    rent.totalDebt = totalDebt;
    rent.isDebtFree = isDebtFree;

    return rent;
  }
}
