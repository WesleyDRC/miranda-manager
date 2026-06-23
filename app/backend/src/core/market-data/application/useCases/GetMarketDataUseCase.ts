import { inject, injectable } from "tsyringe";
import { IMarketDataProvider } from "@/core/market-data/domain/providers/IMarketDataProvider";
import { IMarketDataRepository } from "@/core/market-data/domain/repositories/IMarketDataRepository";
import { MarketDataType } from "@/core/market-data/domain/entities/MarketSnapshot";

@injectable()
export class GetMarketDataUseCase {
  constructor(
    @inject("MarketDataProvider")
    private provider: IMarketDataProvider,
    @inject("MarketDataRepository")
    private repository: IMarketDataRepository
  ) {}

  async getSelicCurrent(): Promise<number> {
    return this.getDataWithFallback("SELIC", () => this.provider.getSelicCurrent());
  }

  async getIpcaFocusProjection(): Promise<number> {
    return this.getDataWithFallback("IPCA_FOCUS", () => this.provider.getIpcaFocusProjection());
  }

  private async getDataWithFallback(type: MarketDataType, fetchApi: () => Promise<number>): Promise<number> {
    try {
      const latest = await this.repository.getLatestSnapshot(type);
      const isFresh = latest && (Date.now() - latest.referenceDate.getTime() < 24 * 60 * 60 * 1000);
      
      if (latest && isFresh) {
        return latest.value;
      }

      const value = await fetchApi();
      
      this.repository.saveSnapshot({
        type,
        referenceDate: new Date(),
        value,
      }).catch(console.error);

      return value;
    } catch (err) {
      const latest = await this.repository.getLatestSnapshot(type);
      if (latest) {
        return latest.value;
      }
      
      if (type === "SELIC") return 10.50;
      if (type === "IPCA_FOCUS") return 4.50;
      throw err;
    }
  }
}
