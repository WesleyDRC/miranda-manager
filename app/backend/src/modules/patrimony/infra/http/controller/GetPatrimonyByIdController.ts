import { Request, Response } from "express";
import { container } from "tsyringe";

import { GetPatrimonyByIdUseCase } from "../../../useCases/GetPatrimonyByIdUseCase";

export class GetPatrimonyByIdController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const getPatrimonyByIdUseCase = container.resolve(GetPatrimonyByIdUseCase);

    const patrimony = await getPatrimonyByIdUseCase.execute(id);

    return res.json({ patrimony });
  }
}
