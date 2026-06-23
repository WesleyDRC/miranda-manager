import { Router } from "express";

import ensureAuthenticated from "@/modules/auth/infra/http/middlewares/ensureAuthenticated";

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

const treasuryRoutes = Router();

const createTreasuryController = new CreateTreasuryController();
const listTreasuriesController = new ListTreasuriesController();
const getTreasuryController = new GetTreasuryController();
const getTreasuryProductsController = new GetTreasuryProductsController();
const updateTreasuryController = new UpdateTreasuryController();
const deleteTreasuryController = new DeleteTreasuryController();
const addTreasuryMovementController = new AddTreasuryMovementController();
const removeTreasuryMovementController = new RemoveTreasuryMovementController();
const createSnapshotController = new CreateSnapshotController();
const getTreasuryMovementsController = new GetTreasuryMovementsController();
const getTreasurySnapshotsController = new GetTreasurySnapshotsController();
const bulkUpdateMarketPriceController = new BulkUpdateMarketPriceController();

// Products Catalog (Must be before /:id to avoid collision)
treasuryRoutes.get("/products", ensureAuthenticated, getTreasuryProductsController.handle);

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
