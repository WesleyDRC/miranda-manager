import {Request, Response} from "express"

import { CreateCategoryUseCase } from "../../../useCases/CreateCategoryUseCase"

import { container } from "tsyringe"

export class CreateCategoryController {
	public async handle(request: Request, response: Response) {

		const { name } = request.body

		const createCategoryUseCase = container.resolve(CreateCategoryUseCase)

		const category = await createCategoryUseCase.execute({
			name, 
		})

		return response.status(201).json({category})
	}
}