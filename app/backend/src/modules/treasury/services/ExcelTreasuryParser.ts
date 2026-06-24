import * as xlsx from "xlsx";

export interface IRawExcelTreasuryRow {
  date?: string | Date;
  title?: string;
  quantity?: number;
  unitPrice?: number;
  investedAmount?: number;
  totalRate?: number;
  selicRate?: number;
  fixedRate?: number;
  [key: string]: any;
}

export class ExcelTreasuryParser {
  public parseBuffer(buffer: Buffer): IRawExcelTreasuryRow[] {
    const workbook = xlsx.read(buffer, { type: "buffer", cellDates: true });
    
    // Pega a primeira aba
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Converte para JSON em formato de array de arrays para podermos encontrar a linha de cabeçalho
    const rawArray: any[][] = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: null });
    
    // Tenta encontrar o título global se for um Extrato Analítico de um único título
    let globalTitle = "";
    if (rawArray.length > 0 && Array.isArray(rawArray[0])) {
      const firstCell = String(rawArray[0][0] || "");
      if (firstCell.toUpperCase().includes("EXTRATO ANALÍTICO")) {
        // Ex: "EXTRATO ANALÍTICO - Tesouro IPCA+ 2029"
        const parts = firstCell.split("-");
        if (parts.length > 1) {
          globalTitle = parts.slice(1).join("-").trim();
        }
      }
    }
    
    // Procura a linha que contém o cabeçalho
    let headerIndex = 0;
    const keywords = ["data", "vencimento", "produto", "título", "titulo", "quantidade", "qtd", "valor", "preço", "preco", "ativo", "bruto", "líquido", "rentabilidade", "aplicação"];
    
    for (let i = 0; i < rawArray.length; i++) {
      const row = rawArray[i];
      if (!Array.isArray(row)) continue;
      
      const rowString = row.filter(Boolean).join(" ").toLowerCase();
      
      let matches = 0;
      for (const kw of keywords) {
          if (rowString.includes(kw)) matches++;
      }
      
      // Se tiver pelo menos 3 palavras-chave que parecem de cabeçalho (pois no extrato analítico tem 2 linhas de header)
      // Vamos preferir a linha mais abaixo das duas (geralmente a segunda tem as colunas mais específicas)
      if (matches >= 3) {
        headerIndex = i;
        // Não damos break imediatamente, continuamos para ver se a próxima linha também é header (pegar a última linha de header fundida)
      } else if (headerIndex > 0) {
        // Achamos os headers, mas a linha atual não é. Então a anterior era a última linha de header.
        break;
      }
    }

    const headers = rawArray[headerIndex] || [];
    const dataRows = rawArray.slice(headerIndex + 1);

    const rawData = dataRows.map(row => {
      const obj: any = {};
      let hasData = false;
      headers.forEach((header, index) => {
        if (header && typeof header === 'string') {
          // Limpa quebras de linha do cabeçalho
          const cleanHeader = header.replace(/\r?\n|\r/g, " ").trim();
          const cellValue = row[index];
          if (cellValue !== undefined && cellValue !== null && String(cellValue).trim() !== '') {
            obj[cleanHeader] = cellValue;
            hasData = true;
          }
        }
      });
      // Aplica o título global se ele existir e a linha não for totalmente vazia
      if (globalTitle && hasData) {
        obj["Título Global Extrato"] = globalTitle;
      }
      return obj;
    });
    
    return this.normalizeHeaders(rawData);
  }

  private normalizeHeaders(rows: any[]): IRawExcelTreasuryRow[] {
    return rows.map((row) => {
      const normalizedRow: any = {};
      
      for (const [key, value] of Object.entries(row)) {
        if (!key) continue;
        const lowerKey = key.toLowerCase().trim();
        
        // Match: Data, Data da Operação, Vencimento (nesse contexto data do aporte)
        if (lowerKey.includes("data") || lowerKey.includes("aplicação") && !lowerKey.includes("preço") && !lowerKey.includes("tempo")) {
          normalizedRow.date = value;
        }
        // Match: Quantidade, Qtd. Títulos, Qtd
        else if (lowerKey.includes("quantidade") || lowerKey.includes("qtd")) {
          normalizedRow.quantity = this.parseNumber(value);
        }
        // Match: Preço Unitário, Preço, PU
        else if (lowerKey.includes("preço") || lowerKey.includes("preco") || lowerKey.includes("unitário") || lowerKey.includes("unitario") || lowerKey.includes("pu ") || lowerKey === "pu") {
          normalizedRow.unitPrice = this.parseNumber(value);
        }
        // Match: Valor Investido, Valor, Bruto
        else if (lowerKey.includes("valor") || lowerKey.includes("investido") || lowerKey.includes("bruto") || lowerKey.includes("líquido")) {
          // damos prioridade ao 'valor investido' ou 'valor'
          if (!normalizedRow.investedAmount || lowerKey.includes("investido")) {
            normalizedRow.investedAmount = this.parseNumber(value);
          }
        }
        // Match: Taxa Total Projetada, Taxa Contratada, Rentabilidade
        else if (lowerKey.includes("taxa total") || lowerKey.includes("rentabilidade") || lowerKey.includes("contratada")) {
          normalizedRow.totalRate = this.parsePercentage(value);
        }
        // Match: Taxa Selic
        else if (lowerKey.includes("selic") && lowerKey.includes("taxa")) {
          normalizedRow.selicRate = this.parsePercentage(value);
        }
        // Match: Taxa Fixa
        else if (lowerKey.includes("fixa") && lowerKey.includes("taxa")) {
          normalizedRow.fixedRate = this.parsePercentage(value);
        }
        // Match: Título, Ativo, Produto (deixamos por último pois "Preço do título" tem "título")
        else if (lowerKey.includes("título global extrato") || lowerKey.includes("título") || lowerKey.includes("titulo") || lowerKey.includes("produto")) {
          normalizedRow.title = value;
        }
      }
      
      return normalizedRow as IRawExcelTreasuryRow;
    });
  }

  private parseNumber(value: any): number | null {
    if (value === null || value === undefined || value === "") return null;
    if (typeof value === "number") return value;
    // Remove pontos de milhares (ex: 2.778,09 -> 2778,09)
    let cleaned = String(value).replace(/\./g, "");
    // Remove tudo que não for dígito, vírgula ou sinal de menos, depois troca a vírgula por ponto
    cleaned = cleaned.replace(/[^\d,-]/g, "").replace(",", ".");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  }

  private parsePercentage(value: any): number | null {
    if (value === null || value === undefined || value === "") return null;
    if (typeof value === "number") {
      // no excel % as vezes já vem como 0.1 para 10%
      return value < 1 ? value * 100 : value;
    }
    let cleaned = String(value).replace(/\./g, "");
    cleaned = cleaned.replace(/[^\d,-]/g, "").replace(",", ".");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  }
}
