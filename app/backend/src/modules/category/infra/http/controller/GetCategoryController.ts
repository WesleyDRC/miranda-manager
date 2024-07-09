import { Request, Response } from "express";

import { container } from "tsyringe";

import { GetCategoryUseCase } from "../../../useCases/GetCategoryUseCase";

export class GetCategoryController {
	public async handle(request: Request, response: Response): Promise<Response> {

		const getCategoryUseCase = container.resolve(GetCategoryUseCase)

		const categories = await getCategoryUseCase.execute()

		return response.json({categories})
	}
}