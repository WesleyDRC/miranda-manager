import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateFinanceUseCase } from "../../../useCases/CreateFinanceUseCase";

export class CreateFinanceController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const { name, categoryId, rent } = request.body;

    const createFinanceUseCase = container.resolve(CreateFinanceUseCase);

    const finance = await createFinanceUseCase.execute({
      name,
      rent,
      categoryId,
      userId,
    });

		return response.json({finance})
  }
}
