import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListTransactionsUseCase } from "../../../useCases/ListTransactionsUseCase";

export class ListTransactionsController {
  public async handle(request: Request, response: Response) {
    const { id: userId } = request.user;

    const listTransactionsUseCase = container.resolve(ListTransactionsUseCase);

    const txs = await listTransactionsUseCase.execute(userId);

    return response.status(200).json({ transactions: txs });
  }
}
