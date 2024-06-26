import "reflect-metadata";
import "dotenv/config";
import "../moongose/";
import "../../container/index";
import "express-async-errors";

import express, { Request, Response, NextFunction } from "express";
import routes from "./routes/routes";
import { AppError } from "../../errors/AppError";

// APP
const app = express();

app.use(express.json());
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
