import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdateRentUseCase } from "@/modules/rent/useCases/UpdateRentUseCase";

export class UpdateRentController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { id } = request.params;
    const updates = request.body;

    const updateRentUseCase = container.resolve(UpdateRentUseCase);

    const rent = await updateRentUseCase.execute({ id, userId, updates });

    return response.json({ rent });
  }
}
