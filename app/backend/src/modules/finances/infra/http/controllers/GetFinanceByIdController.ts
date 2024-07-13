import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetFinanceByIdUseCase } from "../../../useCases/GetFinanceByIdUseCase";

export class GetFinanceByIdController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const { id } = request.params;

    const getFinanceByIdUseCase = container.resolve(GetFinanceByIdUseCase);

    const finance = await getFinanceByIdUseCase.execute({
      id,
      userId,
    });

		return response.json({finance})
  }
}
