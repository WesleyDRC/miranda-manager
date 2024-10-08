import { Request, Response } from "express";

import { CreateRentExpenseUseCase } from "../../../useCases/CreateRentExpenseUseCase";

import { container } from "tsyringe";

export class CreateRentExpenseController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { amount, reason, rentMonthId } = request.body;

    const userId = request.user.id;

    const createRentExpenseUseCase = container.resolve(
      CreateRentExpenseUseCase
    );

    const expense = await createRentExpenseUseCase.execute({
      amount,
      reason,
      rentMonthId,
      userId
    });

    return response.json({ expense });
  }
}
