import {Request, Response} from "express"

import { CreateRentUseCase } from "../../../useCases/CreateRentUseCase"

import { container } from "tsyringe"

export class CreateRentController {
	public async handle(request: Request, response: Response): Promise<Response> {
		const userId = request.user.id

		const {
			tenant,
			value,
			street,
			streetNumber,
			startRental
		} = request.body

		const createRentUseCase = container.resolve(CreateRentUseCase)

		const rent = await createRentUseCase.execute({
			tenant,
			value,
			street,
			streetNumber,
			startRental,
			userId
		})

		return response.json({rent})
	}
}