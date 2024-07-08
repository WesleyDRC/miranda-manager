import { Request, Response } from "express";

import { container } from "tsyringe";

import { GetCategoryByIdUseCase } from "../../../useCases/GetCategoryByIdUseCase";

export class GetCategoryByIdController {
	public async handle(request: Request, response: Response): Promise<Response> {

		const { id } = request.params

		const getCategoryByIdUseCase = container.resolve(GetCategoryByIdUseCase)

		const category = await getCategoryByIdUseCase.execute(id)

		return response.json({category})
	}
}