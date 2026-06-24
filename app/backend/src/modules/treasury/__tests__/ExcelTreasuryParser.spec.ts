import { ExcelTreasuryParser } from "../services/ExcelTreasuryParser";
import * as xlsx from "xlsx";

describe("ExcelTreasuryParser", () => {
  let parser: ExcelTreasuryParser;

  beforeEach(() => {
    parser = new ExcelTreasuryParser();
  });

  it("should normalize headers correctly and extract values", () => {
    // Cria um buffer Excel fictício
    const ws = xlsx.utils.json_to_sheet([
      {
        "Data da Operação": "2024-01-15",
        "Título": "Tesouro IPCA+ 2035",
        "Quantidade": "10",
        "Preço Unitário": "2000,50",
        "Valor Líquido": "20005",
        "Taxa Contratada": "5.5"
      },
      {
        "Data": "2024-02-10",
        "Ativo": "Tesouro Selic 2026",
        "Qtd. Títulos": 5,
        "Preço": 13000.10,
        "Valor Investido": 65000.50,
        "Taxa Selic": "10,50"
      }
    ]);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    const result = parser.parseBuffer(buffer);

    expect(result.length).toBe(2);

    // Row 1 Assertions
    expect(result[0].date).toBe("2024-01-15");
    expect(result[0].title).toBe("Tesouro IPCA+ 2035");
    expect(result[0].quantity).toBe(10);
    expect(result[0].unitPrice).toBe(2000.50);
    expect(result[0].investedAmount).toBe(20005);
    expect(result[0].totalRate).toBe(5.5);

    // Row 2 Assertions
    expect(result[1].date).toBe("2024-02-10");
    expect(result[1].title).toBe("Tesouro Selic 2026");
    expect(result[1].quantity).toBe(5);
    expect(result[1].unitPrice).toBe(13000.1);
    expect(result[1].investedAmount).toBe(65000.5);
    expect(result[1].selicRate).toBe(10.5);
  });

  it("should handle empty or invalid rows gracefully", () => {
    const ws = xlsx.utils.json_to_sheet([
      {
        "Data": "",
        "Título": "",
        "Quantidade": "",
      }
    ]);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    const result = parser.parseBuffer(buffer);

    expect(result.length).toBe(1);
    expect(result[0].date).toBeUndefined();
    expect(result[0].title).toBeUndefined();
    expect(result[0].quantity).toBeNull();
  });
});
