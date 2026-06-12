import mongoose from "mongoose";
import "dotenv/config";
import { User } from "./modules/auth/infra/mongoose/entities/User";
import { Wallet } from "./modules/wallets/infra/mongoose/entities/Wallet";
import { Patrimony } from "./modules/patrimony/infra/mongoose/entities/Patrimony";
import { Transaction } from "./modules/transactions/infra/mongoose/entities/Transaction";
import { RecurrenceRule } from "./modules/transactions/infra/mongoose/entities/RecurrenceRule";

async function seed() {
  const mongoUri = "mongodb://root:example@localhost:27017/miranda_manager_database?authSource=admin";
  await mongoose.connect(mongoUri);

  console.log("Connected to MongoDB");

  const user = await User.findOne();
  if (!user) {
    console.log("No user found! Please register a user first.");
    process.exit(1);
  }

  const userId = user._id;

  // Limpar coleções para evitar duplicidade de regras no rerun
  await Transaction.deleteMany({});
  await RecurrenceRule.deleteMany({});
  await Wallet.deleteMany({});
  await Patrimony.deleteMany({});

  // 1. Create a Wallet with 15k balance
  await Wallet.create({
    name: "Conta Corrente Nubank",
    balance: 15000,
    userId
  });
  console.log("Wallet created");

  // 2. Create a Patrimony (Apartment financed)
  const aptPatrimony = await Patrimony.create({
    name: "Apartamento Centro",
    type: "REAL_ESTATE",
    marketValue: 350000,
    isFinanced: true,
    financingDetails: {
      installmentValue: 3000,
      remainingInstallments: 120, // 10 years
      dueDateDay: 10
    },
    userId
  });

  const today = new Date();

  // Gerar as parcelas físicas do patrimônio (30 anos -> 120 meses neste mock)
  const patrimonyInstallments = [];
  for (let i = 1; i <= 120; i++) {
    const pDate = new Date(today.getFullYear(), today.getMonth() + i, 10);
    patrimonyInstallments.push({
      type: "EXPENSE",
      amount: 3000,
      dueDate: pDate,
      isPaid: false,
      isRecurring: false,
      source: "FINANCING",
      description: `Parcela ${i}/120 - Apartamento Centro`,
      patrimonyId: aptPatrimony._id,
      userId
    });
  }
  await Transaction.insertMany(patrimonyInstallments);
  
  // Create a Car (Paid off, for Bailout Plan if needed)
  await Patrimony.create({
    name: "Honda Civic 2020",
    type: "VEHICLE",
    marketValue: 110000,
    isFinanced: false,
    userId
  });
  console.log("Patrimonies created");

  // 3. Create Recurrence Rules (DDD approach)
  // Salary (Income)
  const salaryRule = await RecurrenceRule.create({
    type: "INCOME",
    amount: 5000,
    dayOfMonth: 5,
    source: "MANUAL",
    description: "Salário Mensal",
    startDate: today,
    userId
  });

  // Regular Expenses
  const expensesRule = await RecurrenceRule.create({
    type: "EXPENSE",
    amount: 2500,
    dayOfMonth: 10,
    source: "MANUAL",
    description: "Gastos Básicos (Mercado, Gasolina, Contas)",
    startDate: today,
    userId
  });

  // Projetar 24 meses físicos na tabela de Transactions
  for (let i = 0; i < 24; i++) {
    const projDateSalary = new Date(today.getFullYear(), today.getMonth() + i, salaryRule.dayOfMonth);
    const projDateExpense = new Date(today.getFullYear(), today.getMonth() + i, expensesRule.dayOfMonth);

    await Transaction.create({
      type: "INCOME", amount: 5000, dueDate: projDateSalary, isPaid: false, isRecurring: true, source: "MANUAL", description: "Salário Mensal", recurrenceRuleId: salaryRule._id, userId
    });

    await Transaction.create({
      type: "EXPENSE", amount: 2500, dueDate: projDateExpense, isPaid: false, isRecurring: true, source: "MANUAL", description: "Gastos Básicos (Mercado, Gasolina, Contas)", recurrenceRuleId: expensesRule._id, userId
    });
  }

  // Balloon Payments (Balões do apartamento - 12 mil)
  // Let's add one in month 6, and one in month 12
  
  const month6 = new Date(today);
  month6.setMonth(month6.getMonth() + 6);
  
  const month12 = new Date(today);
  month12.setMonth(month12.getMonth() + 12);

  await Transaction.create({
    type: "EXPENSE",
    amount: 12000,
    dueDate: month6,
    isPaid: false,
    isRecurring: false,
    source: "MANUAL",
    description: "Balão do Apartamento (Semestral)",
    userId
  });

  await Transaction.create({
    type: "EXPENSE",
    amount: 12000,
    dueDate: month12,
    isPaid: false,
    isRecurring: false,
    source: "MANUAL",
    description: "Balão do Apartamento (Anual)",
    userId
  });

  console.log("Transactions created");
  console.log("Seed finished!");
  process.exit(0);
}

seed().catch(console.error);
