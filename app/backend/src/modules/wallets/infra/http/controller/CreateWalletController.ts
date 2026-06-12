import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateWalletUseCase } from "../../../useCases/CreateWalletUseCase";

export class CreateWalletController {
  public async handle(request: Request, response: Response) {
    const { name, balance } = request.body;
    const { id: userId } = request.user;

    const createWalletUseCase = container.resolve(CreateWalletUseCase);

    const wallet = await createWalletUseCase.execute({
      name,
      balance,
      userId,
    });

    return response.status(201).json({ wallet });
  }
}
