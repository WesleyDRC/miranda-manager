import { Request, Response } from "express";
import { CreateRentPaymentUseCase } from "../../../useCases/CreateRentPaymentUseCase";
import { container } from "tsyringe";

export class CreateRentPaymentController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { amount, paymentDate, rentMonthId } = request.body;
    const userId = request.user.id;

    const createRentPaymentUseCase = container.resolve(
      CreateRentPaymentUseCase
    );

    const payment = await createRentPaymentUseCase.execute({
      amount,
      paymentDate,
      rentMonthId,
      userId
    });

    return response.json({ payment });
  }
}
