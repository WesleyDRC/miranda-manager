import { Router } from "express";

import ensureAuthenticated from "@/modules/auth/infra/http/middlewares/ensureAuthenticated";

import { CreateTransactionController } from "@/modules/transactions/infra/http/controller/CreateTransactionController";
import { ListTransactionsController } from "@/modules/transactions/infra/http/controller/ListTransactionsController";
import { MarkTransactionAsPaidController } from "@/modules/transactions/infra/http/controller/MarkTransactionAsPaidController";

import { ListTransactionsByPatrimonyController } from "@/modules/transactions/infra/http/controller/ListTransactionsByPatrimonyController";
import { UpdateTransactionController } from "@/modules/transactions/infra/http/controller/UpdateTransactionController";
import { DeleteTransactionController } from "@/modules/transactions/infra/http/controller/DeleteTransactionController";

import { z } from "zod";
import { validateRequest } from "@/shared/infra/http/middlewares/validateRequest";

const transactionRoutes = Router();

const createTransactionSchema = z.object({
  body: z.object({
    type: z.enum(["INCOME", "EXPENSE"]),
    amount: z.number().positive(),
    dueDate: z.string().datetime().or(z.date()),
    isPaid: z.boolean().optional(),
    isRecurring: z.boolean().optional(),
    source: z.enum(["MANUAL", "RENT", "FINANCING"]).optional(),
    description: z.string().min(1),
    walletId: z.string().optional(),
    endDate: z.string().datetime().or(z.date()).optional(),
  })
});

const updateTransactionSchema = z.object({
  body: z.object({
    amount: z.number().positive().optional(),
    dueDate: z.string().datetime().or(z.date()).optional(),
    isPaid: z.boolean().optional(),
    description: z.string().min(1).optional(),
    updateRule: z.boolean().optional(),
    endDate: z.string().datetime().or(z.date()).optional(),
  })
});

const createTransactionController = new CreateTransactionController();
const listTransactionsController = new ListTransactionsController();
const markTransactionAsPaidController = new MarkTransactionAsPaidController();
const listTransactionsByPatrimonyController = new ListTransactionsByPatrimonyController();
const updateTransactionController = new UpdateTransactionController();
const deleteTransactionController = new DeleteTransactionController();

transactionRoutes.post("/", ensureAuthenticated, validateRequest(createTransactionSchema), createTransactionController.handle);
transactionRoutes.get("/", ensureAuthenticated, listTransactionsController.handle);
transactionRoutes.get("/patrimony/:patrimonyId", ensureAuthenticated, listTransactionsByPatrimonyController.handle);
transactionRoutes.patch("/:id/pay", ensureAuthenticated, markTransactionAsPaidController.handle);
transactionRoutes.patch("/:id", ensureAuthenticated, validateRequest(updateTransactionSchema), updateTransactionController.handle);
transactionRoutes.delete("/:id", ensureAuthenticated, deleteTransactionController.handle);

export default transactionRoutes;
