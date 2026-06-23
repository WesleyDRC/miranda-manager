import "reflect-metadata";
import "dotenv/config";
import "../moongose/";
import "../../container/index";
import "express-async-errors";

import cors from "cors"
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import routes from "@/shared/infra/http/routes/routes";
import { AppError } from "@/shared/errors/AppError";

// APP
const app = express();

app.use(cors())

app.use(express.json());

// Middleware para logar as requisições no terminal
app.use((request: Request, response: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
  next();
});
app.use("/uploads", express.static(path.resolve(__dirname, "..", "..", "..", "..", "tmp", "uploads")));
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: "error",
      message: err.message,
      metadata: err.metadata,
    });
  }

  // eslint-disable-next-line no-console
  console.error(err);

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

export default app;
