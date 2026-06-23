import cron from "node-cron";
import { container } from "tsyringe";
import { UpdateMarketDataUseCase } from "@/core/market-data/application/useCases/UpdateMarketDataUseCase";

export function initMarketDataCron() {
  // Run daily at 00:01 AM
  cron.schedule("1 0 * * *", async () => {
    console.log("[CRON] Starting Market Data Daily Update...");
    const updateMarketData = container.resolve(UpdateMarketDataUseCase);
    await updateMarketData.execute();
    console.log("[CRON] Market Data Daily Update completed.");
  });

  console.log("[MarketData] Cron job initialized (00:01 AM).");
}
