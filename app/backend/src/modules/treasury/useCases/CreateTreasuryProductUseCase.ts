import { inject, injectable } from "tsyringe";
import { ITreasuryProductRepository } from "../repositories/ITreasuryProductRepository";
import { AppError } from "@/shared/errors/AppError";
import { ITreasuryProductDocument } from "../infra/mongoose/entities/TreasuryProduct";

interface IRequest {
  name: string;
  treasuryType: "SELIC" | "PREFIXADO" | "PREFIXADO_JUROS" | "IPCA" | "IPCA_JUROS";
  maturityDate: Date;
  userId?: string;
}

@injectable()
export class CreateTreasuryProductUseCase {
  constructor(
    @inject("TreasuryProductRepository")
    private treasuryProductRepository: ITreasuryProductRepository
  ) {}

  async execute({ name, treasuryType, maturityDate, userId }: IRequest): Promise<ITreasuryProductDocument> {
    const productAlreadyExists = await this.treasuryProductRepository.findByName(name, userId);

    if (productAlreadyExists) {
      throw new AppError("A treasury product with this name already exists");
    }

    const product = await this.treasuryProductRepository.create({
      name,
      treasuryType,
      maturityDate,
      userId,
    });

    return product;
  }
}
