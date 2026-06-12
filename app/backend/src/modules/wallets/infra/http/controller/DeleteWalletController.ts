import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteWalletUseCase } from "@/modules/wallets/useCases/DeleteWalletUseCase";

export class DeleteWalletController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { id: userId } = request.user;

    const deleteWalletUseCase = container.resolve(DeleteWalletUseCase);

    await deleteWalletUseCase.execute({
      id,
      userId,
    });

    return response.status(204).send();
  }
}
