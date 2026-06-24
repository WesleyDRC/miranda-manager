import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateTreasuryProductUseCase } from "@/modules/treasury/useCases/UpdateTreasuryProductUseCase";

export class UpdateTreasuryProductController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { name, treasuryType, maturityDate } = request.body;

    const updateTreasuryProductUseCase = container.resolve(UpdateTreasuryProductUseCase);

    const product = await updateTreasuryProductUseCase.execute({
      id,
      name,
      treasuryType,
      maturityDate: maturityDate ? new Date(maturityDate) : undefined,
    });

    return response.json(product);
  }
}
