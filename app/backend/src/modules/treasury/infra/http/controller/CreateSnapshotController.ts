import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateSnapshotUseCase } from "@/modules/treasury/useCases/CreateSnapshotUseCase";

export class CreateSnapshotController {
  public async handle(request: Request, response: Response) {
    const { id: userId } = request.user;
    const { treasuryId } = request.params;
    const { snapshotDate } = request.body;

    const createSnapshotUseCase = container.resolve(CreateSnapshotUseCase);

    const snapshot = await createSnapshotUseCase.execute({
      treasuryId,
      userId,
      snapshotDate,
    });

    return response.status(201).json({ snapshot });
  }
}
