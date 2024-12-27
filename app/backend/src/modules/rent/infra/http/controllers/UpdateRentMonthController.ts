import { Request, Response } from "express";
import { UpdateRentMonthUseCase } from "../../../useCases/UpdateRentMonthUseCase";
import { container } from "tsyringe";

export class UpdateRentMonthController {
  public async handle(request: Request, response: Response) {
    const {
      dateMonth,
      amountPaid,
      paid,
    } = request.body;

    const userId = request.user.id

    const { rentId, rentMonthId } = request.params

    const updateRentMonthUseCase = container.resolve(UpdateRentMonthUseCase);

    const rentMonth = await updateRentMonthUseCase.execute({
			rentMonthId,
			userId,
			rentId,
			updates: { 
				dateMonth,
				amountPaid,
				paid,
			}
    });

		return response.json({ rentMonth })
  }
}
