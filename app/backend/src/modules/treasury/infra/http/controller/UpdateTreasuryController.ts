import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateTreasuryUseCase } from "@/modules/treasury/useCases/UpdateTreasuryUseCase";

export class UpdateTreasuryController {
  public async handle(request: Request, response: Response) {
    const { id: userId } = request.user;
    const { id } = request.params;
    const { titleName, annualRate, maturityDate, liquidityAvailable, notes } = request.body;

    const updateTreasuryUseCase = container.resolve(UpdateTreasuryUseCase);

    const investment = await updateTreasuryUseCase.execute({
      id,
      userId,
      titleName,
      annualRate,
      maturityDate,
      liquidityAvailable,
      notes,
    });

    return response.status(200).json({ investment });
  }
}
