import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetTreasuryUseCase } from "@/modules/treasury/useCases/GetTreasuryUseCase";

export class GetTreasuryController {
  public async handle(request: Request, response: Response) {
    const { id: userId } = request.user;
    const { id } = request.params;

    const getTreasuryUseCase = container.resolve(GetTreasuryUseCase);

    const investment = await getTreasuryUseCase.execute({ id, userId });

    return response.status(200).json({ investment });
  }
}
