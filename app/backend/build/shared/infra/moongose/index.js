"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const initializeData_1 = require("./initializeData");
class Database {
    constructor() {
        this.connect();
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const host = process.env.BACKEND_ENVIROMENT === "production" ? process.env.DB_HOST : process.env.MONGO_HOST;
            mongoose_1.default.connect(`mongodb://${host}:${process.env.MONGO_PORT}`, {
                user: process.env.MONGO_USERNAME,
                pass: process.env.MONGO_PASSWORD,
                dbName: process.env.MONGO_DATABASE_NAME
            });
            this.connection = mongoose_1.default.connection;
            this.connection.on("connected", () => __awaiter(this, void 0, void 0, function* () {
                console.log("MongoDB connected successfully");
                yield (0, initializeData_1.initializeData)();
            }));
            this.connection.on("error", (err) => {
                console.error("Error connecting to MongoDB:", err);
            });
            this.connection.on("disconnected", () => {
                console.log("MongoDB disconnected");
            });
        });
    }
}
exports.default = new Database();
