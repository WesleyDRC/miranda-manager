import { injectable, inject } from "tsyringe";
import { ExcelTreasuryParser, IRawExcelTreasuryRow } from "./ExcelTreasuryParser";
import { ITreasuryInvestmentRepository } from "../repositories/ITreasuryInvestmentRepository";

export interface IPreviewTreasuryRow {
  date: Date | null;
  title: string | null;
  quantity: number | null;
  unitPrice: number | null;
  investedAmount: number | null;
  totalRate: number | null;
  selicRate: number | null;
  fixedRate: number | null;
  isValid: boolean;
  errors: string[];
  existingTreasuryId?: string | null;
}

export interface IPreviewResult {
  totalFound: number;
  totalValid: number;
  totalIgnored: number;
  rows: IPreviewTreasuryRow[];
}

@injectable()
export class TreasuryImportService {
  private parser: ExcelTreasuryParser;

  constructor(
    @inject("TreasuryInvestmentRepository")
    private treasuryInvestmentRepository: ITreasuryInvestmentRepository
  ) {
    this.parser = new ExcelTreasuryParser();
  }

  public async previewImport(buffer: Buffer, userId: string): Promise<IPreviewResult> {
    const rawRows = this.parser.parseBuffer(buffer);
    const existingInvestments = await this.treasuryInvestmentRepository.findByUserId(userId);

    const processedRows: IPreviewTreasuryRow[] = [];
    let totalValid = 0;
    let totalIgnored = 0;

    for (const raw of rawRows) {
      const rawDateStr = String(raw.date || "").trim().toLowerCase();
      // Ignorar linhas completamente vazias ou que sejam claramente rodapés/totais da B3
      if (!rawDateStr || rawDateStr === 'total' || rawDateStr.startsWith('(') || rawDateStr.includes('extrato')) {
        totalIgnored++;
        continue;
      }

      const row = this.validateAndFormatRow(raw);
      
      // Attempt to find existing investment
      if (row.title) {
        const existing = existingInvestments.find(inv => inv.titleName.toLowerCase() === row.title!.toLowerCase());
        if (existing) {
          row.existingTreasuryId = existing.id;
        } else {
          // Rule: Permitir vínculo dinâmico no frontend.
          row.existingTreasuryId = null;
          row.errors.push(`Investimento '${row.title}' não encontrado no sistema. Por favor, vincule-o manualmente.`);
        }
      }

      if (!row.isValid) {
        console.log(`[Importação] Linha inválida: ${JSON.stringify(raw)} | Erros: ${row.errors.join(", ")}`);
      }

      if (row.isValid) {
        totalValid++;
      }

      processedRows.push(row);
    }

    return {
      totalFound: processedRows.length + totalIgnored,
      totalValid,
      totalIgnored,
      rows: processedRows
    };
  }

  private validateAndFormatRow(raw: IRawExcelTreasuryRow): IPreviewTreasuryRow {
    const errors: string[] = [];
    let isValid = true;
    
    let parsedDate: Date | null = null;
    if (raw.date) {
      if (raw.date instanceof Date) {
        parsedDate = raw.date;
      } else {
        // Assume formato DD/MM/YYYY ou similar e tenta converter
        const dateStr = String(raw.date);
        const parts = dateStr.split("/");
        if (parts.length === 3) {
          parsedDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
        } else if (!isNaN(Number(dateStr))) {
          // Se for número (Excel Serial Date)
          const excelDays = Number(dateStr);
          parsedDate = new Date(Math.round((excelDays - 25569) * 86400 * 1000));
          // Ajuda com fuso horário adicionando 3h
          parsedDate.setUTCHours(12);
        } else {
          parsedDate = new Date(dateStr);
        }
      }
      
      if (isNaN(parsedDate.getTime())) {
        errors.push("Data inválida.");
        isValid = false;
        parsedDate = null;
      }
    } else {
      errors.push("Data ausente.");
      isValid = false;
    }

    if (!raw.title) {
      errors.push("Título ausente.");
      isValid = false;
    }

    if (!raw.investedAmount && raw.investedAmount !== 0) {
      errors.push("Valor investido ausente.");
      isValid = false;
    }

    return {
      date: parsedDate,
      title: raw.title || null,
      quantity: raw.quantity || null,
      unitPrice: raw.unitPrice || null,
      investedAmount: raw.investedAmount || null,
      totalRate: raw.totalRate || null,
      selicRate: raw.selicRate || null,
      fixedRate: raw.fixedRate || null,
      isValid,
      errors
    };
  }
}
