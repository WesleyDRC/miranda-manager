import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetTreasurySnapshotsUseCase } from "@/modules/treasury/useCases/GetTreasurySnapshotsUseCase";

export class GetTreasurySnapshotsController {
  public async handle(request: Request, response: Response) {
    const { treasuryId } = request.params;

    const getTreasurySnapshotsUseCase = container.resolve(GetTreasurySnapshotsUseCase);

    const snapshots = await getTreasurySnapshotsUseCase.execute(treasuryId);

    return response.status(200).json({ snapshots });
  }
}
