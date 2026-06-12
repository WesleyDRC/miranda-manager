import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreatePatrimonyUseCase } from "@/modules/patrimony/useCases/CreatePatrimonyUseCase";

export class CreatePatrimonyController {
  public async handle(request: Request, response: Response) {
    const { name, type, marketValue, isFinanced, financingDetails } = request.body;
    const { id: userId } = request.user;

    const createPatrimonyUseCase = container.resolve(CreatePatrimonyUseCase);

    const patrimony = await createPatrimonyUseCase.execute({
      name,
      type,
      marketValue,
      isFinanced,
      financingDetails,
      userId,
    });

    return response.status(201).json({ patrimony });
  }
}
