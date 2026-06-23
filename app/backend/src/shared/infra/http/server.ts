import app from "@/shared/infra/http/app"
import { initMarketDataCron } from "@/core/market-data/infrastructure/cron/MarketDataCronJob"

app.listen(parseInt(process.env.PORT), process.env.HOST, () => {
	console.log(`Starting server in port: ${process.env.PORT} `)
    initMarketDataCron();
})