import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListPatrimonyUseCase } from "@/modules/patrimony/useCases/ListPatrimonyUseCase";

export class ListPatrimonyController {
  public async handle(request: Request, response: Response) {
    const { id: userId } = request.user;

    const listPatrimonyUseCase = container.resolve(ListPatrimonyUseCase);

    const patrimonies = await listPatrimonyUseCase.execute(userId);

    return response.status(200).json({ patrimonies });
  }
}
