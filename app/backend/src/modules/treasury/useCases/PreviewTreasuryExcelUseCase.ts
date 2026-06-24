import { inject, injectable } from "tsyringe";
import { IUseCase } from "./ports/IUseCase";
import { TreasuryImportService, IPreviewResult } from "../services/TreasuryImportService";

interface IRequest {
  buffer: Buffer;
  userId: string;
}

@injectable()
export class PreviewTreasuryExcelUseCase implements IUseCase {
  constructor(
    private treasuryImportService: TreasuryImportService
  ) {}

  async execute({ buffer, userId }: IRequest): Promise<IPreviewResult> {
    return this.treasuryImportService.previewImport(buffer, userId);
  }
}
