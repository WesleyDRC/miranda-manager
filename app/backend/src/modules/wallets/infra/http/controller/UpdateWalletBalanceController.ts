import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateWalletBalanceUseCase } from "@/modules/wallets/useCases/UpdateWalletBalanceUseCase";

export class UpdateWalletBalanceController {
  public async handle(request: Request, response: Response) {
    const { id } = request.params;
    const { balance } = request.body;

    const updateWalletBalanceUseCase = container.resolve(UpdateWalletBalanceUseCase);

    const wallet = await updateWalletBalanceUseCase.execute({
      id,
      balance,
    });

    return response.status(200).json({ wallet });
  }
}
