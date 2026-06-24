import { TreasuryProduct } from "../infra/mongoose/entities/TreasuryProduct";

export class InitializeTreasuryProductsUseCase {
  async execute(): Promise<void> {
    const defaultProducts = [
      { name: "Tesouro Selic 2026", treasuryType: "SELIC", maturityDate: "2026-03-01T00:00:00.000Z" },
      { name: "Tesouro Selic 2029", treasuryType: "SELIC", maturityDate: "2029-03-01T00:00:00.000Z" },
      { name: "Tesouro Prefixado 2026", treasuryType: "PREFIXADO", maturityDate: "2026-01-01T00:00:00.000Z" },
      { name: "Tesouro Prefixado 2029", treasuryType: "PREFIXADO", maturityDate: "2029-01-01T00:00:00.000Z" },
      { name: "Tesouro Prefixado 2032", treasuryType: "PREFIXADO", maturityDate: "2032-01-01T00:00:00.000Z" },
      { name: "Tesouro IPCA+ 2029", treasuryType: "IPCA", maturityDate: "2029-05-15T00:00:00.000Z" },
      { name: "Tesouro IPCA+ 2035", treasuryType: "IPCA", maturityDate: "2035-05-15T00:00:00.000Z" },
      { name: "Tesouro IPCA+ 2045", treasuryType: "IPCA", maturityDate: "2045-05-15T00:00:00.000Z" },
      { name: "Tesouro Educa+ 2026", treasuryType: "IPCA", maturityDate: "2026-12-15T00:00:00.000Z" },
      { name: "Tesouro RendA+ 2030", treasuryType: "IPCA", maturityDate: "2030-12-15T00:00:00.000Z" }
    ];

    for (const prod of defaultProducts) {
      const exists = await TreasuryProduct.findOne({ name: prod.name });
      if (!exists) {
        await TreasuryProduct.create({
          name: prod.name,
          treasuryType: prod.treasuryType,
          maturityDate: new Date(prod.maturityDate)
        });
      }
    }
  }
}
