import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteTransactionService } from "../../../services/DeleteTransactionService";

export class DeleteTransactionController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { deleteHistory } = request.query;
    const { id: userId } = request.user;

    const deleteTransactionService = container.resolve(DeleteTransactionService);

    await deleteTransactionService.execute(id, userId, deleteHistory === 'true');

    return response.status(204).send();
  }
}
