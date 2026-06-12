import { inject, injectable } from "tsyringe";

import { IUseCase } from "@/modules/rent/useCases/ports/IUseCase";
import { IRentRepository } from "@/modules/rent/repositories/IRentRepository";
import { IRent } from "@/modules/rent/entities/IRent";
import { rentConstants } from "@/modules/rent/contants/rentConstants";
import { AppError } from "@/shared/errors/AppError";

@injectable()
export class UpdateRentUseCase implements IUseCase {
  constructor(
    @inject("RentRepository")
    private rentRepository: IRentRepository
  ) {}

  async execute({
    id,
    userId,
    updates,
  }: {
    id: string;
    userId: string;
    updates: Partial<IRent>;
  }): Promise<IRent> {
    const rentFound = await this.rentRepository.findById({ id, userId });

    if (!rentFound) {
      throw new AppError(rentConstants.NOT_FOUND, 404);
    }

    const updatedRent = await this.rentRepository.update(id, userId, updates);

    if (!updatedRent) {
      throw new AppError("Erro ao atualizar o aluguel", 400);
    }

    return updatedRent;
  }
}
