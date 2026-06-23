import { inject, injectable } from "tsyringe";
import { IMarketDataProvider } from "@/core/market-data/domain/providers/IMarketDataProvider";
import { IMarketDataRepository } from "@/core/market-data/domain/repositories/IMarketDataRepository";

@injectable()
export class UpdateMarketDataUseCase {
  constructor(
    @inject("MarketDataProvider")
    private provider: IMarketDataProvider,
    @inject("MarketDataRepository")
    private repository: IMarketDataRepository
  ) {}

  async execute(): Promise<void> {
    try {
      const selic = await this.provider.getSelicCurrent();
      await this.repository.saveSnapshot({
        type: "SELIC",
        referenceDate: new Date(),
        value: selic,
      });
      
      const ipcaFocus = await this.provider.getIpcaFocusProjection();
      await this.repository.saveSnapshot({
        type: "IPCA_FOCUS",
        referenceDate: new Date(),
        value: ipcaFocus,
      });
      
      console.log(`[MarketData] Updated SELIC (${selic}%) and IPCA FOCUS (${ipcaFocus}%)`);
    } catch (error) {
      console.error("[MarketData] Error updating market data:", error);
    }
  }
}
