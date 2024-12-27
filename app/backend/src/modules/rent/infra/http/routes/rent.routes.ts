import { Router } from "express";

import ensureAuthenticated from "../../../../auth/infra/http/middlewares/ensureAuthenticated";

import { CreateRentController } from "../controllers/CreateRentController";
import { GetRentByIdController } from "../controllers/GetRentByIdController";
import { CreateRentExpenseController } from "../controllers/CreateRentExpenseController";
import { UpdateRentMonthController } from "../controllers/UpdateRentMonthController";
import { UpdateRentExpenseController } from "../controllers/UpdateRentExpenseController";
import { DeleteRentExpenseController } from "../controllers/DeleteRentExpenseController";
import { CreateRentReceiptController } from "../controllers/CreateRentReceiptController";
import { GetRentReceiptController } from "../controllers/GetRentReceiptController";

import { upload } from "../middlewares/uploadImagesMulter";

const rentRoutes = Router();

const createRentController = new CreateRentController();
const getRentByIdController = new GetRentByIdController();
const createRentExpenseController = new CreateRentExpenseController();
const updateRentMonthController = new UpdateRentMonthController();
const updateRentExpenseController = new UpdateRentExpenseController();
const deleteRentExpenseController = new DeleteRentExpenseController();
const createRentReceiptController = new CreateRentReceiptController();
const getRentReceiptController = new GetRentReceiptController();

rentRoutes.post("/", ensureAuthenticated, createRentController.handle);
rentRoutes.get("/:id", ensureAuthenticated, getRentByIdController.handle);
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
)

export default rentRoutes;
