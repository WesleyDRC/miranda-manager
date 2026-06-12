import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdatePatrimonyUseCase } from "@/modules/patrimony/useCases/UpdatePatrimonyUseCase";

export class UpdatePatrimonyController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const data = request.body;

    const updatePatrimonyUseCase = container.resolve(UpdatePatrimonyUseCase);

    const patrimony = await updatePatrimonyUseCase.execute({ id, data });

    return response.json(patrimony);
  }
}
