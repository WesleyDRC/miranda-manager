import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTreasuryUseCase } from "@/modules/treasury/useCases/CreateTreasuryUseCase";

export class CreateTreasuryController {
  public async handle(request: Request, response: Response) {
    const { id: userId } = request.user;
    const {
      treasuryType,
      titleName,
      purchaseDate,
      maturityDate,
      investedAmount,
      annualRate,
      liquidityAvailable,
      quantity,
      unitPrice,
      notes,
    } = request.body;

    const createTreasuryUseCase = container.resolve(CreateTreasuryUseCase);

    const investment = await createTreasuryUseCase.execute({
      userId,
      treasuryType,
      titleName,
      purchaseDate,
      maturityDate,
      investedAmount,
      annualRate,
      liquidityAvailable,
      quantity,
      unitPrice,
      notes,
    });

    return response.status(201).json({ investment });
  }
}
