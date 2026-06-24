import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteTreasuryProductUseCase } from "@/modules/treasury/useCases/DeleteTreasuryProductUseCase";

export class DeleteTreasuryProductController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteTreasuryProductUseCase = container.resolve(DeleteTreasuryProductUseCase);

    await deleteTreasuryProductUseCase.execute(id);

    return response.status(204).send();
  }
}
