import { Router } from "express";

import ensureAuthenticated from "@/modules/auth/infra/http/middlewares/ensureAuthenticated";

import { CreateRentController } from "@/modules/rent/infra/http/controllers/CreateRentController";
import { GetRentByIdController } from "@/modules/rent/infra/http/controllers/GetRentByIdController";
import { CreateRentExpenseController } from "@/modules/rent/infra/http/controllers/CreateRentExpenseController";
import { UpdateRentMonthController } from "@/modules/rent/infra/http/controllers/UpdateRentMonthController";
import { UpdateRentExpenseController } from "@/modules/rent/infra/http/controllers/UpdateRentExpenseController";
import { DeleteRentExpenseController } from "@/modules/rent/infra/http/controllers/DeleteRentExpenseController";
import { CreateRentReceiptController } from "@/modules/rent/infra/http/controllers/CreateRentReceiptController";
import { GetRentReceiptController } from "@/modules/rent/infra/http/controllers/GetRentReceiptController";
import { DeleteRentReceiptController } from "@/modules/rent/infra/http/controllers/DeleteRentReceiptController";

import { CreateRentPaymentController } from "@/modules/rent/infra/http/controllers/CreateRentPaymentController";
import { DeleteRentPaymentController } from "@/modules/rent/infra/http/controllers/DeleteRentPaymentController";
import { GetRentDashboardController } from "@/modules/rent/infra/http/controllers/GetRentDashboardController";
import { UpdateRentController } from "@/modules/rent/infra/http/controllers/UpdateRentController";

import { upload } from "@/modules/rent/infra/http/middlewares/uploadImagesMulter";

const rentRoutes = Router();

const createRentController = new CreateRentController();
const getRentByIdController = new GetRentByIdController();
const createRentExpenseController = new CreateRentExpenseController();
const updateRentMonthController = new UpdateRentMonthController();
const updateRentExpenseController = new UpdateRentExpenseController();
const deleteRentExpenseController = new DeleteRentExpenseController();
const createRentReceiptController = new CreateRentReceiptController();
const getRentReceiptController = new GetRentReceiptController();
const deleteRentReceiptController = new DeleteRentReceiptController();
const createRentPaymentController = new CreateRentPaymentController();
const deleteRentPaymentController = new DeleteRentPaymentController();
const getRentDashboardController = new GetRentDashboardController();
const updateRentController = new UpdateRentController();

rentRoutes.post("/", ensureAuthenticated, createRentController.handle);
rentRoutes.get("/", ensureAuthenticated, getRentDashboardController.handle);
rentRoutes.get("/:id", ensureAuthenticated, getRentByIdController.handle);
rentRoutes.patch("/:id", ensureAuthenticated, updateRentController.handle);
rentRoutes.patch(
  "/:rentId/month/:rentMonthId",
  ensureAuthenticated,
  updateRentMonthController.handle
);
rentRoutes.post(
  "/expense",
  ensureAuthenticated,
  createRentExpenseController.handle
);
rentRoutes.patch(
  "/expense/:rentExpenseId",
  ensureAuthenticated,
  updateRentExpenseController.handle
);
rentRoutes.delete(
  "/expense/:rentExpenseId",
  ensureAuthenticated,
  deleteRentExpenseController.handle
);
rentRoutes.post(
  "/receipt/:rentMonthId",
  ensureAuthenticated,
  upload.single("receipt"),
  createRentReceiptController.handle
);
rentRoutes.get(
  "/receipt/:rentMonthId",
  ensureAuthenticated,
  getRentReceiptController.handle
);
rentRoutes.delete(
  "/receipt/:receiptId",
  ensureAuthenticated,
  deleteRentReceiptController.handle
);
rentRoutes.post(
  "/payment",
  ensureAuthenticated,
  createRentPaymentController.handle
);
rentRoutes.delete(
  "/payment/:paymentId",
  ensureAuthenticated,
  deleteRentPaymentController.handle
);

export default rentRoutes;
