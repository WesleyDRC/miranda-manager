import { Request, Response } from "express";
import { container } from "tsyringe";
import { ConfirmTreasuryImportUseCase } from "@/modules/treasury/useCases/ConfirmTreasuryImportUseCase";

export class ConfirmTreasuryImportController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { id: userId } = request.user;
    const { rows } = request.body;

    if (!rows || !Array.isArray(rows)) {
      return response.status(400).json({ message: "Rows invalid ou ausentes." });
    }

    const confirmUseCase = container.resolve(ConfirmTreasuryImportUseCase);

    const result = await confirmUseCase.execute({
      userId,
      rows,
    });

    return response.json(result);
  }
}
