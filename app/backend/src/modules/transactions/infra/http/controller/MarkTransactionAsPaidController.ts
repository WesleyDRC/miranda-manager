import { Request, Response } from "express";
import { container } from "tsyringe";
import { MarkTransactionAsPaidUseCase } from "../../../useCases/MarkTransactionAsPaidUseCase";

export class MarkTransactionAsPaidController {
  public async handle(request: Request, response: Response) {
    const { id } = request.params;
    const { walletId } = request.body;

    const markTransactionAsPaidUseCase = container.resolve(MarkTransactionAsPaidUseCase);

    const tx = await markTransactionAsPaidUseCase.execute({ id, walletId });

    return response.status(200).json({ transaction: tx });
  }
}
