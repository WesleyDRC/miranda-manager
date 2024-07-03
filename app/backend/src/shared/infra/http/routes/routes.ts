import { Router } from "express"

import authRoutes from "../../../../modules/auth/infra/http/routes/auth.routes"
import categoryRoutes from "../../../../modules/category/infra/http/routes/category.routes"
import financeRoutes from "../../../../modules/finances/infra/http/routes/finance.routes"

const routes = Router()

routes.get("/health-check", (request, response) => {
	response.json({ message: "Ok"})
})

routes.use("/auth", authRoutes)
routes.use("/category", categoryRoutes)
routes.use("/finance", financeRoutes)

export default routes