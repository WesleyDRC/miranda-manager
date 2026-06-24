import { Router } from "express";

import ensureAuthenticated from "@/modules/auth/infra/http/middlewares/ensureAuthenticated";

import multer from "multer";

import { CreateTreasuryController } from "@/modules/treasury/infra/http/controller/CreateTreasuryController";
import { ListTreasuriesController } from "@/modules/treasury/infra/http/controller/ListTreasuriesController";
import { GetTreasuryController } from "@/modules/treasury/infra/http/controller/GetTreasuryController";
import { UpdateTreasuryController } from "@/modules/treasury/infra/http/controller/UpdateTreasuryController";
import { DeleteTreasuryController } from "@/modules/treasury/infra/http/controller/DeleteTreasuryController";
import { AddTreasuryMovementController } from "@/modules/treasury/infra/http/controller/AddTreasuryMovementController";
import { RemoveTreasuryMovementController } from "@/modules/treasury/infra/http/controller/RemoveTreasuryMovementController";
import { CreateSnapshotController } from "@/modules/treasury/infra/http/controller/CreateSnapshotController";
import { GetTreasuryProductsController } from "@/modules/treasury/infra/http/controller/GetTreasuryProductsController";
import { GetTreasuryMovementsController } from "@/modules/treasury/infra/http/controller/GetTreasuryMovementsController";
import { GetTreasurySnapshotsController } from "@/modules/treasury/infra/http/controller/GetTreasurySnapshotsController";
import { BulkUpdateMarketPriceController } from "@/modules/treasury/infra/http/controller/BulkUpdateMarketPriceController";
import { PreviewTreasuryExcelController } from "@/modules/treasury/infra/http/controller/PreviewTreasuryExcelController";
import { ConfirmTreasuryImportController } from "@/modules/treasury/infra/http/controller/ConfirmTreasuryImportController";

import { CreateTreasuryProductController } from "@/modules/treasury/infra/http/controller/CreateTreasuryProductController";
import { UpdateTreasuryProductController } from "@/modules/treasury/infra/http/controller/UpdateTreasuryProductController";
import { DeleteTreasuryProductController } from "@/modules/treasury/infra/http/controller/DeleteTreasuryProductController";

const treasuryRoutes = Router();
const uploadMemory = multer({ storage: multer.memoryStorage() });

const createTreasuryController = new CreateTreasuryController();
const listTreasuriesController = new ListTreasuriesController();
const getTreasuryController = new GetTreasuryController();
const getTreasuryProductsController = new GetTreasuryProductsController();
const createTreasuryProductController = new CreateTreasuryProductController();
const updateTreasuryProductController = new UpdateTreasuryProductController();
const deleteTreasuryProductController = new DeleteTreasuryProductController();
const updateTreasuryController = new UpdateTreasuryController();
const deleteTreasuryController = new DeleteTreasuryController();
const addTreasuryMovementController = new AddTreasuryMovementController();
const removeTreasuryMovementController = new RemoveTreasuryMovementController();
const createSnapshotController = new CreateSnapshotController();
const getTreasuryMovementsController = new GetTreasuryMovementsController();
const getTreasurySnapshotsController = new GetTreasurySnapshotsController();
const bulkUpdateMarketPriceController = new BulkUpdateMarketPriceController();
const previewTreasuryExcelController = new PreviewTreasuryExcelController();
const confirmTreasuryImportController = new ConfirmTreasuryImportController();

// Products Catalog (Must be before /:id to avoid collision)
treasuryRoutes.get("/products", ensureAuthenticated, getTreasuryProductsController.handle);
treasuryRoutes.post("/products", ensureAuthenticated, createTreasuryProductController.handle);
treasuryRoutes.put("/products/:id", ensureAuthenticated, updateTreasuryProductController.handle);
treasuryRoutes.delete("/products/:id", ensureAuthenticated, deleteTreasuryProductController.handle);

// Excel Import (Must be before /:id)
treasuryRoutes.post("/import-excel", ensureAuthenticated, uploadMemory.single("file"), previewTreasuryExcelController.handle);
treasuryRoutes.post("/import-excel/confirm", ensureAuthenticated, confirmTreasuryImportController.handle);

// Investment CRUD
treasuryRoutes.post("/", ensureAuthenticated, createTreasuryController.handle);
treasuryRoutes.patch("/bulk-market-price", ensureAuthenticated, bulkUpdateMarketPriceController.handle);
treasuryRoutes.get("/", ensureAuthenticated, listTreasuriesController.handle);
treasuryRoutes.get("/:id", ensureAuthenticated, getTreasuryController.handle);
treasuryRoutes.patch("/:id", ensureAuthenticated, updateTreasuryController.handle);
treasuryRoutes.delete("/:id", ensureAuthenticated, deleteTreasuryController.handle);

// Movements
treasuryRoutes.post("/:treasuryId/movement", ensureAuthenticated, addTreasuryMovementController.handle);
treasuryRoutes.get("/:treasuryId/movement", ensureAuthenticated, getTreasuryMovementsController.handle);
treasuryRoutes.delete("/movement/:movementId", ensureAuthenticated, removeTreasuryMovementController.handle);

// Snapshots
treasuryRoutes.post("/:treasuryId/snapshot", ensureAuthenticated, createSnapshotController.handle);
treasuryRoutes.get("/:treasuryId/snapshot", ensureAuthenticated, getTreasurySnapshotsController.handle);

export default treasuryRoutes;
