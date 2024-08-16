import { Request, Response } from "express";
import { UpdateRentExpenseUseCase } from "../../../useCases/UpdateRentExpenseUseCase";
import { container } from "tsyringe";

export class UpdateRentExpenseController {
  public async handle(request: Request, response: Response) {
    const { amount, reason } = request.body;

    const userId = request.user.id;

    const { rentExpenseId } = request.params;

    const updateRentExpenseUseCase = container.resolve(
      UpdateRentExpenseUseCase
    );

    const rentExpense = await updateRentExpenseUseCase.execute({
      rentExpenseId,
      userId,
      updates: {
        amount,
        reason,
      },
    });

    return response.json({ rentExpense });
  }
}
