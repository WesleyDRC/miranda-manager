import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTreasuryProductUseCase } from "@/modules/treasury/useCases/CreateTreasuryProductUseCase";

export class CreateTreasuryProductController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, treasuryType, maturityDate } = request.body;
    const { id: userId } = request.user; // Se rotas autenticadas

    const createTreasuryProductUseCase = container.resolve(CreateTreasuryProductUseCase);

    const product = await createTreasuryProductUseCase.execute({
      name,
      treasuryType,
      maturityDate: new Date(maturityDate),
      userId,
    });

    return response.status(201).json(product);
  }
}
