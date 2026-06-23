import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteTreasuryUseCase } from "@/modules/treasury/useCases/DeleteTreasuryUseCase";

export class DeleteTreasuryController {
  public async handle(request: Request, response: Response) {
    const { id: userId } = request.user;
    const { id } = request.params;

    const deleteTreasuryUseCase = container.resolve(DeleteTreasuryUseCase);

    await deleteTreasuryUseCase.execute({ id, userId });

    return response.status(204).send();
  }
}
