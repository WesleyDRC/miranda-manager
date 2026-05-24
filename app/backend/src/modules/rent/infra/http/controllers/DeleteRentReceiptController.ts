import { Request, Response } from "express";
import { DeleteRentReceiptUseCase } from "../../../useCases/DeleteRentReceiptUseCase";
import { container } from "tsyringe";

export class DeleteRentReceiptController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { receiptId } = request.params;

    const deleteRentReceiptUseCase = container.resolve(
      DeleteRentReceiptUseCase
    );

    await deleteRentReceiptUseCase.execute({
      id: receiptId,
    });

    return response.json({ message: "Comprovante deletado com sucesso" });
  }
}
