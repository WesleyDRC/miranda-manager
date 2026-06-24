import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetTreasuryProductsUseCase } from "@/modules/treasury/useCases/GetTreasuryProductsUseCase";

export class GetTreasuryProductsController {
  async handle(request: Request, response: Response): Promise<Response> {
    // If you don't have request.user here because it's not authenticated or similar,
    // just pass undefined or make it authenticated.
    const userId = request.user?.id;
    const getTreasuryProductsUseCase = container.resolve(GetTreasuryProductsUseCase);

    const products = await getTreasuryProductsUseCase.execute(userId);

    return response.json({ products });
  }
}
