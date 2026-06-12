import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateWalletUseCase } from "@/modules/wallets/useCases/UpdateWalletUseCase";

export class UpdateWalletController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, balance } = request.body;
    const { id: userId } = request.user;

    const updateWalletUseCase = container.resolve(UpdateWalletUseCase);

    const wallet = await updateWalletUseCase.execute({
      id,
      name,
      balance,
      userId,
    });

    return response.json(wallet);
  }
}
