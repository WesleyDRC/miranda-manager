import { Router } from "express";

import ensureAuthenticated from "../../../../auth/infra/http/middlewares/ensureAuthenticated";

import { CreateTransactionController } from "../controller/CreateTransactionController";
import { ListTransactionsController } from "../controller/ListTransactionsController";
import { MarkTransactionAsPaidController } from "../controller/MarkTransactionAsPaidController";

import { ListTransactionsByPatrimonyController } from "../controller/ListTransactionsByPatrimonyController";
import { UpdateTransactionController } from "../controller/UpdateTransactionController";
import { DeleteTransactionController } from "../controller/DeleteTransactionController";

const transactionRoutes = Router();

const createTransactionController = new CreateTransactionController();
const listTransactionsController = new ListTransactionsController();
const markTransactionAsPaidController = new MarkTransactionAsPaidController();
const listTransactionsByPatrimonyController = new ListTransactionsByPatrimonyController();
const updateTransactionController = new UpdateTransactionController();

transactionRoutes.post("/", ensureAuthenticated, createTransactionController.handle);
transactionRoutes.get("/", ensureAuthenticated, listTransactionsController.handle);
transactionRoutes.get("/patrimony/:patrimonyId", ensureAuthenticated, listTransactionsByPatrimonyController.handle);
transactionRoutes.patch("/:id/pay", ensureAuthenticated, markTransactionAsPaidController.handle);
transactionRoutes.patch("/:id", ensureAuthenticated, updateTransactionController.handle);

const deleteTransactionController = new DeleteTransactionController();
transactionRoutes.delete("/:id", ensureAuthenticated, deleteTransactionController.handle);

export default transactionRoutes;
