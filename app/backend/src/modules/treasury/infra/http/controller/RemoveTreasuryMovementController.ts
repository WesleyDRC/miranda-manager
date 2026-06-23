import { Request, Response } from "express";
import { container } from "tsyringe";
import { RemoveTreasuryMovementUseCase } from "@/modules/treasury/useCases/RemoveTreasuryMovementUseCase";

export class RemoveTreasuryMovementController {
  public async handle(request: Request, response: Response) {
    const { id: userId } = request.user;
    const { movementId } = request.params;

    const removeMovementUseCase = container.resolve(RemoveTreasuryMovementUseCase);

    await removeMovementUseCase.execute({ movementId, userId });

    return response.status(204).send();
  }
}
