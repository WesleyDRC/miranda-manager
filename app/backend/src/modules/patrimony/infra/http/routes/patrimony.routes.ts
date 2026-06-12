import { Router } from "express";

import ensureAuthenticated from "../../../../auth/infra/http/middlewares/ensureAuthenticated";

import { CreatePatrimonyController } from "../controller/CreatePatrimonyController";
import { ListPatrimonyController } from "../controller/ListPatrimonyController";
import { SellPatrimonyController } from "../controller/SellPatrimonyController";

import { GetPatrimonyByIdController } from "../controller/GetPatrimonyByIdController";
import { UpdatePatrimonyController } from "../controller/UpdatePatrimonyController";

const patrimonyRoutes = Router();

const createPatrimonyController = new CreatePatrimonyController();
const listPatrimonyController = new ListPatrimonyController();
const sellPatrimonyController = new SellPatrimonyController();
const getPatrimonyByIdController = new GetPatrimonyByIdController();
const updatePatrimonyController = new UpdatePatrimonyController();

patrimonyRoutes.post("/", ensureAuthenticated, createPatrimonyController.handle);
patrimonyRoutes.get("/", ensureAuthenticated, listPatrimonyController.handle);
patrimonyRoutes.get("/:id", ensureAuthenticated, getPatrimonyByIdController.handle);
patrimonyRoutes.patch("/:id", ensureAuthenticated, updatePatrimonyController.handle);
patrimonyRoutes.delete("/:id", ensureAuthenticated, sellPatrimonyController.handle);

export default patrimonyRoutes;
