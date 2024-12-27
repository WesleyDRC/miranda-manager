import { Router } from "express";

import ensureAuthenticated from "../../../../auth/infra/http/middlewares/ensureAuthenticated";

import { CreateRentController } from "../controllers/CreateRentController";
import { GetRentByIdController } from "../controllers/GetRentByIdController";
import { CreateRentExpenseController } from "../controllers/CreateRentExpenseController";
import { UpdateRentMonthController } from "../controllers/UpdateRentMonthController";
import { UpdateRentExpenseController } from "../controllers/UpdateRentExpenseController";
import { DeleteRentExpenseController } from "../controllers/DeleteRentExpenseController"; 
import { CreateRentReceiptController } from "../controllers/CreateRentReceiptController"

import { upload } from "../middlewares/uploadImagesMulter";

const rentRoutes = Router();

const createRentController = new CreateRentController();
const getRentByIdController = new GetRentByIdController();
const createRentExpenseController = new CreateRentExpenseController();
const updateRentMonthController = new UpdateRentMonthController();
const updateRentExpenseController = new UpdateRentExpenseController();
const deleteRentExpenseController = new DeleteRentExpenseController();
const createRentReceiptController = new CreateRentReceiptController()

rentRoutes.post("/", ensureAuthenticated, createRentController.handle);
rentRoutes.get("/:id", ensureAuthenticated, getRentByIdController.handle);
rentRoutes.patch(
  "/:rentId/month/:rentMonthId",
  ensureAuthenticated,
	upload.single("receipt"),
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
)

export default rentRoutes;
