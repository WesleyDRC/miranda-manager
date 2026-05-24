import { Request, Response } from "express";
import { DeleteRentPaymentUseCase } from "../../../useCases/DeleteRentPaymentUseCase";
import { container } from "tsyringe";

export class DeleteRentPaymentController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { paymentId } = request.params;
    const userId = request.user.id;

    const deleteRentPaymentUseCase = container.resolve(
      DeleteRentPaymentUseCase
    );

    await deleteRentPaymentUseCase.execute({
      id: paymentId,
      userId
    });

    return response.json({ message: "Pagamento deletado com sucesso" });
  }
}
