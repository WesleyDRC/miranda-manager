import { inject, injectable } from "tsyringe";

import { IUseCase } from "@/modules/patrimony/useCases/ports/IUseCase";
import { IPatrimonyRepository } from "@/modules/patrimony/repositories/IPatrimonyRepository";
import { IPatrimony } from "@/modules/patrimony/entities/IPatrimony";

@injectable()
export class ListPatrimonyUseCase implements IUseCase {
  constructor(
    @inject("PatrimonyRepository")
    private patrimonyRepository: IPatrimonyRepository
  ) {}

  async execute(userId: string): Promise<IPatrimony[]> {
    const patrimonies = await this.patrimonyRepository.findByUserId(userId);
    return patrimonies;
  }
}
