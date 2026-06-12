import { Request, Response } from "express";
import { container } from "tsyringe";
import { SellPatrimonyUseCase } from "../../../useCases/SellPatrimonyUseCase";

export class SellPatrimonyController {
  public async handle(request: Request, response: Response) {
    const { id } = request.params;

    const sellPatrimonyUseCase = container.resolve(SellPatrimonyUseCase);

    await sellPatrimonyUseCase.execute(id);

    return response.status(204).send();
  }
}
