"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const BCryptHashProvider_1 = require("./implementations/BCryptHashProvider");
tsyringe_1.container.registerSingleton("HashProvider", BCryptHashProvider_1.BCryptHashProvider);
