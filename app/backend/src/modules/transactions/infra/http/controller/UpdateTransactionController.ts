import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateTransactionUseCase } from "../../../useCases/UpdateTransactionUseCase";

export class UpdateTransactionController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { amount, dueDate, description, isPaid, updateRule, endDate } = request.body;
    
    // Injected by authentication middleware
    const userId = request.user.id;

    const updateTransactionUseCase = container.resolve(UpdateTransactionUseCase);

    const transaction = await updateTransactionUseCase.execute({
      id,
      userId,
      amount,
      dueDate,
      description,
      isPaid,
      updateRule,
      endDate: endDate ? new Date(endDate) : undefined
    });

    return response.json(transaction);
  }
}
