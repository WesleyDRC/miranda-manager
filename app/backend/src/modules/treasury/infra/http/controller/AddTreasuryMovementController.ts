import { Request, Response } from "express";
import { container } from "tsyringe";
import { AddTreasuryMovementUseCase } from "@/modules/treasury/useCases/AddTreasuryMovementUseCase";

export class AddTreasuryMovementController {
  public async handle(request: Request, response: Response) {
    const { id: userId } = request.user;
    const { treasuryId } = request.params;
    const { movementType, amount, movementDate, description } = request.body;

    const addMovementUseCase = container.resolve(AddTreasuryMovementUseCase);

    const movement = await addMovementUseCase.execute({
      userId,
      treasuryId,
      movementType,
      amount,
      movementDate,
      description,
    });

    return response.status(201).json({ movement });
  }
}
