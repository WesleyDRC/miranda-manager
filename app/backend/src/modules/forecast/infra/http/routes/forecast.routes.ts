import { Router } from "express";

import ensureAuthenticated from "@/modules/auth/infra/http/middlewares/ensureAuthenticated";
import { GetForecastController } from "@/modules/forecast/infra/http/controller/GetForecastController";

const forecastRoutes = Router();
const getForecastController = new GetForecastController();

forecastRoutes.get("/dashboard", ensureAuthenticated, getForecastController.handle);

export default forecastRoutes;
