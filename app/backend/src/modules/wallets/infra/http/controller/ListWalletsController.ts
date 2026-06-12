import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListWalletsUseCase } from "@/modules/wallets/useCases/ListWalletsUseCase";

export class ListWalletsController {
  public async handle(request: Request, response: Response) {
    const { id: userId } = request.user;

    const listWalletsUseCase = container.resolve(ListWalletsUseCase);

    const wallets = await listWalletsUseCase.execute(userId);

    return response.status(200).json({ wallets });
  }
}
