import { Request, Response } from "express";
import { container } from "tsyringe";

import { GetRentByIdUseCase } from "../../../useCases/GetRentByIdUseCase";


export class GetRentByIdController {
	public async handle(request: Request, response: Response): Promise<Response> {

		const userId = request.user.id
		
		const { id } = request.params

		const getRentByIdUseCase = container.resolve(GetRentByIdUseCase)

		const rent = await getRentByIdUseCase.execute({id, userId})

		return response.json({rent})

	}
}