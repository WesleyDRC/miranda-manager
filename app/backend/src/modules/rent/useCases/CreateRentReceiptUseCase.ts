import { inject, injectable } from "tsyringe";
import path from "path";
import fs from "fs";

import { IRentReceipt } from "@/modules/rent/entities/IRentReceipt";
import { IStoreRentReceiptDTO } from "@/modules/rent/dtos/IStoreRentReceiptDTO";
import { IRentRepository } from "@/modules/rent/repositories/IRentRepository";
import { IUseCase } from "@/modules/rent/useCases/ports/IUseCase";

import { rentConstants } from "@/modules/rent/contants/rentConstants";
import uploadConfig from "@/config/upload";
import { AppError } from "@/shared/errors/AppError";

@injectable()
export class CreateRentReceiptUseCase implements IUseCase {
	constructor(
		@inject("RentRepository")
		private rentRepository: IRentRepository
	){}
	async execute({
		receipt,
		rentMonthId,
	}: IStoreRentReceiptDTO ): Promise<IRentReceipt> {

    const rentMonth = await this.rentRepository.findRentMonthById({ id: rentMonthId });

		if(!rentMonth) {
			throw new AppError(rentConstants.RENT_MONTH_NOT_FOUND, 404)
		}

		if(!receipt) {
			throw new AppError(rentConstants.UPLOAD_VALID_FILE, 400)
		}

		const tempFilePath = this.getReceiptPath(receipt);
		const newFilePath = `${uploadConfig.uploadsFolder}/${path.basename(tempFilePath)}`;

		if (!fs.existsSync(tempFilePath)) {
			throw new AppError(rentConstants.FILE_NOT_FOUND, 404);
		}

		// Move the file (temporary file will be removed automatically)
		fs.renameSync(tempFilePath, newFilePath);

		receipt = newFilePath;

		const rentReceipt = await this.rentRepository.createRentReceipt({
			receipt,
			rentMonthId: rentMonth.id,
		})

		return rentReceipt
	}

	private getReceiptPath(receipt: Express.Multer.File | string): string {
    if (typeof receipt === "string") {
      return receipt;
    }
    if ("path" in receipt) {
      return receipt.path;
    }
    throw new AppError("Formato de arquivo inválido.", 400);
  }
}