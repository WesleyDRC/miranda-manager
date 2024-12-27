import { inject, injectable } from "tsyringe";

import { IUseCase } from "./ports/IUseCase";
import { IRentRepository } from "../repositories/IRentRepository";
import { IRent } from "../entities/IRent";

import { rentConstants } from "../contants/rentConstants";

import { loadImage } from "../../../shared/utils/loadImage";

import { AppError } from "../../../shared/errors/AppError";
import { IRentReceipt } from "../entities/IRentReceipt";

@injectable()
export class GetRentReceiptUseCase implements IUseCase {
  constructor(
    @inject("RentRepository")
    private rentRepository: IRentRepository
  ) {}

  async execute({ rentMonthId }): Promise<IRentReceipt[]> {
    const rentMonthFound = await this.rentRepository.findRentMonthById({
      id: rentMonthId,
    });

    if (!rentMonthFound) {
      throw new AppError(rentConstants.RENT_MONTH_NOT_FOUND, 404);
    }

    const rentReceiptsByRenthMonth = await this.rentRepository.findRentReceipts(
      rentMonthId
    );

    const receipts = await Promise.all(
      rentReceiptsByRenthMonth.map(async (receipt) => {
        const imageConvertedToBufffer = await loadImage(receipt.receipt);

        return {
          id: receipt.id,
          receipt: imageConvertedToBufffer.toString("base64"),
          rentMonthId: receipt.rentMonthId,
        };
      })
    );

    return receipts;
  }
}
