import { Request, Response } from "express";
import { DeleteRentExpenseUseCase } from "../../../useCases/DeleteRentExpenseUseCase";
import { container } from "tsyringe";

export class DeleteRentExpenseController {
  public async handle(request: Request, response: Response) {
    const userId = request.user.id;

    const { rentExpenseId } = request.params;

    const deleteRentExpenseUseCase = container.resolve(
      DeleteRentExpenseUseCase
    );

    await deleteRentExpenseUseCase.execute({
      rentExpenseId,
      userId,
    });

    return response.json({ message: "Rent expense deleted successfully." });
  }
}
