import { Request, Response } from "express";

import { container } from "tsyringe";

import { GetCategoryUseCase } from "../../../useCases/GetCategoryUseCase";

export class GetCategoryController {
	public async handle(request: Request, response: Response): Promise<Response> {
		const userId = request.user.id

		const getCategoryUseCase = container.resolve(GetCategoryUseCase)

		const categories = await getCategoryUseCase.execute(userId)

		return response.json({categories})
	}
}