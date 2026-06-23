import { Router } from "express"

import authRoutes from "@/modules/auth/infra/http/routes/auth.routes"
import categoryRoutes from "@/modules/category/infra/http/routes/category.routes"
import financeRoutes from "@/modules/finances/infra/http/routes/finance.routes"
import rentRoutes from "@/modules/rent/infra/http/routes/rent.routes"
import walletRoutes from "@/modules/wallets/infra/http/routes/wallet.routes"
import patrimonyRoutes from "@/modules/patrimony/infra/http/routes/patrimony.routes"
import transactionRoutes from "@/modules/transactions/infra/http/routes/transaction.routes"
import forecastRoutes from "@/modules/forecast/infra/http/routes/forecast.routes"
import treasuryRoutes from "@/modules/treasury/infra/http/routes/treasury.routes"
import uploadRoutes from "@/shared/infra/http/routes/upload.routes"
import marketDataRoutes from "@/core/market-data/presentation/routes/market-data.routes"

const routes = Router()

routes.get("/health-check", (request, response) => {
	response.json({ message: "Ok"})
})

routes.use("/auth", authRoutes)
routes.use("/category", categoryRoutes)
routes.use("/finance", financeRoutes)
routes.use("/rent", rentRoutes)
routes.use("/wallet", walletRoutes)
routes.use("/patrimony", patrimonyRoutes)
routes.use("/transaction", transactionRoutes)
routes.use("/forecast", forecastRoutes)
routes.use("/treasury", treasuryRoutes)
routes.use("/upload", uploadRoutes)
routes.use("/market-data", marketDataRoutes)

export default routes