import { inject, injectable } from "tsyringe";
import { IPreviewTreasuryRow } from "../services/TreasuryImportService";
import { AddTreasuryMovementUseCase } from "./AddTreasuryMovementUseCase";
import { CreateTreasuryUseCase } from "./CreateTreasuryUseCase";
import { ITreasuryMovementRepository } from "../repositories/ITreasuryMovementRepository";
import { ITreasuryInvestmentRepository } from "../repositories/ITreasuryInvestmentRepository";
import { AppError } from "@/shared/errors/AppError";
import { IUseCase } from "./ports/IUseCase";

interface IRequest {
  userId: string;
  rows: IPreviewTreasuryRow[];
}

export interface IConfirmImportResult {
  totalImported: number;
  totalDuplicates: number;
  totalFailed: number;
}

@injectable()
export class ConfirmTreasuryImportUseCase implements IUseCase {
  constructor(
    private addTreasuryMovementUseCase: AddTreasuryMovementUseCase,
    private createTreasuryUseCase: CreateTreasuryUseCase,
    @inject("TreasuryMovementRepository")
    private treasuryMovementRepository: ITreasuryMovementRepository,
    @inject("TreasuryInvestmentRepository")
    private treasuryInvestmentRepository: ITreasuryInvestmentRepository
  ) {}

  async execute({ userId, rows }: IRequest): Promise<IConfirmImportResult> {
    let totalImported = 0;
    let totalDuplicates = 0;
    let totalFailed = 0;

    for (const row of rows) {
      const payloadRow = row as any;
      if (!row.isValid || !payloadRow.titleName || !row.date || !row.investedAmount) {
        console.log(`row.isValid: ${!row.isValid}`)
        console.log(`titleName: ${!payloadRow.titleName}`)
        console.log(`date: ${!row.date}`)
        console.log(`investedAmount: ${!row.investedAmount}`)
        totalFailed++;
        continue;
      }

      const movementDate = new Date(row.date);
      const amount = row.investedAmount;

      try {
        // Lógica de Deduplicação:
        // Buscar se já existe um TreasuryInvestment com o mesmo título, mesma data e mesmo valor
        console.log("Teste")
        const existingInvestments = await this.treasuryInvestmentRepository.findByUserId(userId);
        console.log("existingInvestments")
        console.log(existingInvestments)

        const isDuplicate = existingInvestments.some(inv => {
          const d1 = new Date(inv.purchaseDate);
          console.log("Exist the same investiment")
          console.log(`payloadRow.titleName: ${payloadRow.titleName}`)
          console.log(`inv.titleName ${inv.titleName}`)

          return inv.titleName === payloadRow.titleName &&
                 inv.investedAmount === amount &&
                 d1.getFullYear() === movementDate.getFullYear() &&
                 d1.getMonth() === movementDate.getMonth() &&
                 d1.getDate() === movementDate.getDate();
        });

        if (isDuplicate) {
          totalDuplicates++;
          continue;
        }

        console.log("payloadRow")
        console.log(payloadRow)
        console.log("")

        const details = payloadRow.productDetails || {};
        const titleUpper = (payloadRow.titleName || '').toUpperCase();
        
        let treasuryType = details.treasuryType;
        if (!treasuryType) {
            if (titleUpper.includes('IPCA')) treasuryType = 'IPCA';
            else if (titleUpper.includes('SELIC')) treasuryType = 'SELIC';
            else treasuryType = 'PREFIXADO';
        }

        const fixed = payloadRow.fixedRate ? Number(payloadRow.fixedRate) : 0;
        const indexer = payloadRow.selicRate ? Number(payloadRow.selicRate) : 0;
        const customAnnual = payloadRow.annualRate ? Number(payloadRow.annualRate) : 0;

        let finalAnnualRate = customAnnual;
        if (treasuryType.includes('IPCA') || treasuryType.includes('SELIC')) {
            finalAnnualRate = fixed + indexer;
        }

        let finalMaturityDate = details.maturityDate;
        if (!finalMaturityDate) {
            const yearMatch = payloadRow.titleName?.match(/\b(20\d{2})\b/);
            if (yearMatch) {
                finalMaturityDate = new Date(Number(yearMatch[1]), 0, 1);
            } else {
                finalMaturityDate = movementDate;
            }
        } else {
            finalMaturityDate = new Date(finalMaturityDate);
        }

        await this.createTreasuryUseCase.execute({
            userId,
            titleName: payloadRow.titleName,
            treasuryType: treasuryType,
            purchaseDate: movementDate,
            maturityDate: finalMaturityDate,
            investedAmount: amount, // O valor do aporte!
            annualRate: finalAnnualRate,
            quantity: payloadRow.quantity ? Number(payloadRow.quantity) : undefined,
            unitPrice: payloadRow.unitPrice ? Number(payloadRow.unitPrice) : undefined,
            liquidityAvailable: true
        });

        totalImported++;
      } catch (err) {
        console.log("Adding more one in catch")
        totalFailed++;
      }
    }

    console.log(`totalFailed: ${totalFailed}`)
    console.log("called here")

    return { totalImported, totalDuplicates, totalFailed };
  }
}
