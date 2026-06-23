import { Router } from "express";
import { MarketDataController } from "@/core/market-data/presentation/controllers/MarketDataController";
import ensureAuthenticated from "@/modules/auth/infra/http/middlewares/ensureAuthenticated";

const marketDataRouter = Router();
const marketDataController = new MarketDataController();

// Rotas públicas
marketDataRouter.get("/stream", marketDataController.stream);

// Rotas autenticadas
marketDataRouter.use(ensureAuthenticated);
marketDataRouter.get("/selic", marketDataController.getSelic);
marketDataRouter.get("/ipca", marketDataController.getIpcaFocus);

export default marketDataRouter;
