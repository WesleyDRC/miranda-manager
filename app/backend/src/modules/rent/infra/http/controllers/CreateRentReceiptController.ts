import {Request, Response} from "express"

import { CreateRentReceiptUseCase } from "../../../useCases/CreateRentReceiptUseCase"

import { container } from "tsyringe"

export class CreateRentReceiptController {
	public async handle(request: Request, response: Response): Promise<Response> {

    const receipt = request.file

		const { rentMonthId } = request.params

		const createRentReceiptUseCase = container.resolve(CreateRentReceiptUseCase)

		const rentReceipt = await createRentReceiptUseCase.execute({
			receipt,
			rentMonthId,
		})

		return response.json({rentReceipt})
	}
}