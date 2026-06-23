import { IMarketDataProvider } from "@/core/market-data/domain/providers/IMarketDataProvider";
import { IMarketSnapshot } from "@/core/market-data/domain/entities/MarketSnapshot";
import { HttpClientService } from "@/core/market-data/infrastructure/http/HttpClientService";
import { AppError } from "@/shared/errors/AppError";

export class BCBMarketDataProvider implements IMarketDataProvider {
  private sgsClient: HttpClientService;
  private olindaClient: HttpClientService;

  constructor() {
    this.sgsClient = new HttpClientService(process.env.BCB_SGS_API_URL || "https://api.bcb.gov.br/dados/serie/bcdata.sgs");
    this.olindaClient = new HttpClientService(process.env.BCB_OLINDA_API_URL || "https://olinda.bcb.gov.br/olinda/servico/Expectativas/versao/v1/odata");
  }

  private createSnapshot(type: "SELIC" | "IPCA" | "TREASURY" | "IPCA_FOCUS", value: number, referenceDate: Date): IMarketSnapshot {
    return {
      id: "virtual",
      type,
      referenceDate,
      value,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async getSelicCurrent(): Promise<number> {
    // Meta Selic is serie 432
    const data = await this.sgsClient.get<any[]>("/432/dados/ultimos/1?formato=json");
    if (!data || data.length === 0) throw new AppError("Failed to fetch SELIC from BCB");
    return Number(data[0].valor);
  }

  async getSelicHistory(): Promise<IMarketSnapshot[]> {
    const data = await this.sgsClient.get<any[]>("/432/dados/ultimos/30?formato=json");
    return data.map((item) => this.createSnapshot("SELIC", Number(item.valor), new Date(item.data.split("/").reverse().join("-"))));
  }

  async getIpcaCurrent(): Promise<number> {
    // IPCA monthly is serie 433
    const data = await this.sgsClient.get<any[]>("/433/dados/ultimos/1?formato=json");
    if (!data || data.length === 0) throw new AppError("Failed to fetch IPCA from BCB");
    return Number(data[0].valor);
  }

  async getIpcaHistory(): Promise<IMarketSnapshot[]> {
    const data = await this.sgsClient.get<any[]>("/433/dados/ultimos/12?formato=json");
    return data.map((item) => this.createSnapshot("IPCA", Number(item.valor), new Date(item.data.split("/").reverse().join("-"))));
  }

  async getIpcaFocusProjection(): Promise<number> {
    // Fetch median expectation for the current year + 2 years ahead (long term)
    // Actually, getting the current year's Focus expectation is standard. Let's get next year's to be safer for 2029.
    const nextYear = new Date().getFullYear() + 1;
    const url = `/ExpectativasMercadoAnuais?$format=json&$filter=Indicador eq 'IPCA' and DataReferencia eq '${nextYear}'&$top=1&$orderby=Data desc`;
    const data = await this.olindaClient.get<any>(url);
    
    if (!data || !data.value || data.value.length === 0) {
      throw new AppError("Failed to fetch IPCA Focus from BCB Olinda");
    }
    return Number(data.value[0].Mediana);
  }

  async getTreasuryPrices(): Promise<IMarketSnapshot[]> {
    return [];
  }
}
