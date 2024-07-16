import {Request, Response} from "express"

import { CreateRentExpenseUseCase } from "../../../useCases/CreateRentExpenseUseCase"

import { container } from "tsyringe"

export class CreateRentExpenseController {
	public async handle(request: Request, response: Response): Promise<Response> {
		const {
			value,
			reason,
			rentId,
		} = request.body

		const userId = request.user.id

		const createRentExpenseUseCase = container.resolve(CreateRentExpenseUseCase)

		const rent = await createRentExpenseUseCase.execute({
			value,
			reason,
			rentId,
			userId
		})

		return response.json({rent})
	}
}