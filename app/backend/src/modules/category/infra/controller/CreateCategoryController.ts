import {Request, Response} from "express"

export class CreateCategoryController {
	public async handle(request: Request, response: Response) {

		const userId = request.user.id


		return response.json({userId})
	}
}