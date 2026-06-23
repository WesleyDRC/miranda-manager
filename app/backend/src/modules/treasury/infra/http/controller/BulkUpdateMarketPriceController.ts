import { Request, Response } from "express";
import { container } from "tsyringe";
import { BulkUpdateMarketPriceUseCase } from "@/modules/treasury/useCases/BulkUpdateMarketPriceUseCase";

export class BulkUpdateMarketPriceController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { titleName, marketUnitPrice } = request.body;
    const { id: userId } = request.user;

    const useCase = container.resolve(BulkUpdateMarketPriceUseCase);
    await useCase.execute({ userId, titleName, marketUnitPrice });

    return response.status(204).send();
  }
}
