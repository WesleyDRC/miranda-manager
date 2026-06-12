import { inject, injectable } from "tsyringe";

import { IUseCase } from "@/modules/patrimony/useCases/ports/IUseCase";
import { IPatrimonyRepository } from "@/modules/patrimony/repositories/IPatrimonyRepository";
import { IPatrimony } from "@/modules/patrimony/entities/IPatrimony";

@injectable()
export class GetPatrimonyByIdUseCase implements IUseCase {
  constructor(
    @inject("PatrimonyRepository")
    private patrimonyRepository: IPatrimonyRepository
  ) {}

  async execute(id: string): Promise<IPatrimony | null> {
    const patrimony = await this.patrimonyRepository.findById(id);
    return patrimony;
  }
}
