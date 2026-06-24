import { inject, injectable } from "tsyringe";
import { ITreasuryProductRepository } from "../repositories/ITreasuryProductRepository";
import { AppError } from "@/shared/errors/AppError";
import { ITreasuryProductDocument } from "../infra/mongoose/entities/TreasuryProduct";

interface IRequest {
  id: string;
  name?: string;
  treasuryType?: "SELIC" | "PREFIXADO" | "PREFIXADO_JUROS_SEMESTRAIS" | "IPCA" | "IPCA_JUROS_SEMESTRAIS";
  maturityDate?: Date;
}

@injectable()
export class UpdateTreasuryProductUseCase {
  constructor(
    @inject("TreasuryProductRepository")
    private treasuryProductRepository: ITreasuryProductRepository
  ) {}

  async execute({ id, name, treasuryType, maturityDate }: IRequest): Promise<ITreasuryProductDocument> {
    const product = await this.treasuryProductRepository.findById(id);

    if (!product) {
      throw new AppError("Treasury product not found", 404);
    }

    if (name && name !== product.name) {
      const nameExists = await this.treasuryProductRepository.findByName(name);
      if (nameExists && nameExists.id !== id) {
        throw new AppError("A treasury product with this name already exists");
      }
    }

    const updatedProduct = await this.treasuryProductRepository.update(id, {
      ...(name && { name }),
      ...(treasuryType && { treasuryType }),
      ...(maturityDate && { maturityDate })
    });

    if (!updatedProduct) {
      throw new AppError("Failed to update treasury product");
    }

    return updatedProduct;
  }
}
