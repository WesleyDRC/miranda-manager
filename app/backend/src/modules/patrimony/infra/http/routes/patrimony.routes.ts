import { Router } from "express";

import ensureAuthenticated from "@/modules/auth/infra/http/middlewares/ensureAuthenticated";

import { CreatePatrimonyController } from "@/modules/patrimony/infra/http/controller/CreatePatrimonyController";
import { ListPatrimonyController } from "@/modules/patrimony/infra/http/controller/ListPatrimonyController";
import { SellPatrimonyController } from "@/modules/patrimony/infra/http/controller/SellPatrimonyController";

import { GetPatrimonyByIdController } from "@/modules/patrimony/infra/http/controller/GetPatrimonyByIdController";
import { UpdatePatrimonyController } from "@/modules/patrimony/infra/http/controller/UpdatePatrimonyController";

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
