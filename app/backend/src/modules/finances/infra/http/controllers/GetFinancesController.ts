import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetFinancesUseCase } from "../../../useCases/GetFinancesUseCase";

export class GetFinancesController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const getFinancesUseCase = container.resolve(GetFinancesUseCase);

    const finances = await getFinancesUseCase.execute({
      userId
    });

		return response.json({finances})
  }
}
