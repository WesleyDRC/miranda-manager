import { Router } from "express";

import ensureAuthenticated from "../../../../auth/infra/http/middlewares/ensureAuthenticated";

import { CreateWalletController } from "../controller/CreateWalletController";
import { ListWalletsController } from "../controller/ListWalletsController";
import { UpdateWalletBalanceController } from "../controller/UpdateWalletBalanceController";

const walletRoutes = Router();

const createWalletController = new CreateWalletController();
const listWalletsController = new ListWalletsController();
const updateWalletBalanceController = new UpdateWalletBalanceController();

walletRoutes.post("/", ensureAuthenticated, createWalletController.handle);
walletRoutes.get("/", ensureAuthenticated, listWalletsController.handle);
walletRoutes.patch("/:id/balance", ensureAuthenticated, updateWalletBalanceController.handle);

export default walletRoutes;
