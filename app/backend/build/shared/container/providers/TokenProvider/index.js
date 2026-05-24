"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const TokenProvider_1 = require("./implementations/TokenProvider");
tsyringe_1.container.registerSingleton("TokenProvider", TokenProvider_1.JwTProvider);
