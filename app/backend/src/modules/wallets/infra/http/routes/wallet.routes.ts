import { Router } from "express";

import ensureAuthenticated from "@/modules/auth/infra/http/middlewares/ensureAuthenticated";

import { CreateWalletController } from "@/modules/wallets/infra/http/controller/CreateWalletController";
import { ListWalletsController } from "@/modules/wallets/infra/http/controller/ListWalletsController";
import { UpdateWalletBalanceController } from "@/modules/wallets/infra/http/controller/UpdateWalletBalanceController";
import { UpdateWalletController } from "@/modules/wallets/infra/http/controller/UpdateWalletController";
import { DeleteWalletController } from "@/modules/wallets/infra/http/controller/DeleteWalletController";

const walletRoutes = Router();

const createWalletController = new CreateWalletController();
const listWalletsController = new ListWalletsController();
const updateWalletBalanceController = new UpdateWalletBalanceController();
const updateWalletController = new UpdateWalletController();
const deleteWalletController = new DeleteWalletController();

walletRoutes.post("/", ensureAuthenticated, createWalletController.handle);
walletRoutes.get("/", ensureAuthenticated, listWalletsController.handle);
walletRoutes.patch("/:id/balance", ensureAuthenticated, updateWalletBalanceController.handle);
walletRoutes.patch("/:id", ensureAuthenticated, updateWalletController.handle);
walletRoutes.delete("/:id", ensureAuthenticated, deleteWalletController.handle);

export default walletRoutes;
