import { Request, Response } from "express";
import { container } from "tsyringe";
import { PreviewTreasuryExcelUseCase } from "@/modules/treasury/useCases/PreviewTreasuryExcelUseCase";

export class PreviewTreasuryExcelController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { id: userId } = request.user;
    const file = request.file;

    if (!file) {
      return response.status(400).json({ message: "Arquivo não enviado." });
    }

    const previewUseCase = container.resolve(PreviewTreasuryExcelUseCase);

    const result = await previewUseCase.execute({
      buffer: file.buffer,
      userId,
    });

    return response.json(result);
  }
}
