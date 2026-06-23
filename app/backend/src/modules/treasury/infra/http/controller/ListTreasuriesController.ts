import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListTreasuriesUseCase } from "@/modules/treasury/useCases/ListTreasuriesUseCase";

export class ListTreasuriesController {
  public async handle(request: Request, response: Response) {
    const { id: userId } = request.user;

    const listTreasuriesUseCase = container.resolve(ListTreasuriesUseCase);

    const investments = await listTreasuriesUseCase.execute(userId);

    return response.status(200).json({ investments });
  }
}
