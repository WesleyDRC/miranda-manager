import "dotenv/config"
import express from "express";

import "./config/database/mongoose/index"

import { RentWorker } from "./domain/services/RentWorker";
import { RentRepository } from "./modules/rent/repository/RentRepositoy";
import { RentMonthRepository } from "./modules/rent-month/repository/RentMonthRepository";
import { RentExpenseRepository } from "./modules/rent-expense/repository/RentExpenseRepository";

const app = express();

app.use(express.json());

app.use("/health-check", (req, res) => {
  res.json({ message: "Ok" });
});

const rentRepository = new RentRepository();
const rentMonthRepository = new RentMonthRepository();
const rentExpenseRepository = new RentExpenseRepository();

const rentWorker = new RentWorker(rentRepository, rentMonthRepository, rentExpenseRepository);

setInterval(async () => {
  await rentWorker.worker()
}, 1000)

export default app