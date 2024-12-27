import { Request, Response } from "express";
import { container } from "tsyringe";

import { GetRentReceiptUseCase } from "../../../useCases/GetRentReceiptUseCase";

export class GetRentReceiptController {
	public async handle(request: Request, response: Response): Promise<Response> {

		//const userId = request.user.id
		
		const { rentMonthId } = request.params

		const getRentReceiptUseCase = container.resolve(GetRentReceiptUseCase)

		const receipts = await getRentReceiptUseCase.execute({rentMonthId})

		return response.json({receipts})
	}
}