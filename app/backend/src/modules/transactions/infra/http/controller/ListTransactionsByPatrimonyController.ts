import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListTransactionsByPatrimonyUseCase } from "@/modules/transactions/useCases/ListTransactionsByPatrimonyUseCase";

export class ListTransactionsByPatrimonyController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { patrimonyId } = req.params;

    const listTransactionsByPatrimonyUseCase = container.resolve(
      ListTransactionsByPatrimonyUseCase
    );

    const transactions = await listTransactionsByPatrimonyUseCase.execute(patrimonyId);

    return res.json({ transactions });
  }
}
