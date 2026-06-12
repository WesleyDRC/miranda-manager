import { inject, injectable } from "tsyringe";

import { IUseCase } from "./ports/IUseCase";
import { IPatrimonyRepository } from "../repositories/IPatrimonyRepository";
import { IPatrimony } from "../entities/IPatrimony";

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
