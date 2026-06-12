import { Router } from "express";

import ensureAuthenticated from "../../../../auth/infra/http/middlewares/ensureAuthenticated";
import { GetForecastController } from "../controller/GetForecastController";

const forecastRoutes = Router();
const getForecastController = new GetForecastController();

forecastRoutes.get("/dashboard", ensureAuthenticated, getForecastController.handle);

export default forecastRoutes;
