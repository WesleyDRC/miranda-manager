import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransactionUseCase } from "@/modules/transactions/useCases/CreateTransactionUseCase";

export class CreateTransactionController {
  public async handle(request: Request, response: Response) {
    const { type, amount, dueDate, isPaid, isRecurring, source, description, walletId, endDate } = request.body;
    const { id: userId } = request.user;

    const createTransactionUseCase = container.resolve(CreateTransactionUseCase);

    const tx = await createTransactionUseCase.execute({
      type,
      amount,
      dueDate,
      isPaid,
      isRecurring,
      source,
      description,
      walletId,
      userId,
      endDate: endDate ? new Date(endDate) : undefined,
    });

    return response.status(201).json({ transaction: tx });
  }
}
