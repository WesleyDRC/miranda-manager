import { Router } from "express"

import authRoutes from "../../../../modules/auth/infra/http/routes/auth.routes"
import categoryRoutes from "../../../../modules/category/infra/routes/category.routes"

const routes = Router()

routes.get("/health-check", (request, response) => {
	response.json({ message: "Ok"})
})

routes.use("/auth", authRoutes)
routes.use("/category", categoryRoutes)

export default routes