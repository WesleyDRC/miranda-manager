import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetTreasuryMovementsUseCase } from "@/modules/treasury/useCases/GetTreasuryMovementsUseCase";

export class GetTreasuryMovementsController {
  public async handle(request: Request, response: Response) {
    const { treasuryId } = request.params;

    const getTreasuryMovementsUseCase = container.resolve(GetTreasuryMovementsUseCase);

    const movements = await getTreasuryMovementsUseCase.execute(treasuryId);

    return response.status(200).json({ movements });
  }
}
