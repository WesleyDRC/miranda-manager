import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateFinanceUseCase } from "../../../useCases/CreateFinanceUseCase";

export class CreateFinanceController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const { name, category, rent } = request.body;

    const createFinanceUseCase = container.resolve(CreateFinanceUseCase);

    const finance = await createFinanceUseCase.execute({
      name,
      rent,
      category,
      userId,
    });

		return response.json({finance})
  }
}
