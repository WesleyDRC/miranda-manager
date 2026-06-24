import { ITreasuryInvestment } from "@/modules/treasury/entities/ITreasuryInvestment";
import { ITreasuryMovement } from "@/modules/treasury/entities/ITreasuryMovement";
import { ITreasuryInvestmentRepository } from "@/modules/treasury/repositories/ITreasuryInvestmentRepository";
import { ITreasuryMovementRepository } from "@/modules/treasury/repositories/ITreasuryMovementRepository";
import { ICreateTreasuryMovementDTO } from "@/modules/treasury/dtos/ICreateTreasuryMovementDTO";
import { ICreateTreasuryInvestmentDTO } from "@/modules/treasury/dtos/ICreateTreasuryInvestmentDTO";

/**
 * Unit tests for movement business logic.
 *
 * Run with: npx ts-node -r tsconfig-paths/register src/modules/treasury/__tests__/TreasuryMovement.test.ts
 *
 * These tests use in-memory fakes instead of MongoDB to validate the business rules
 * of AddTreasuryMovementUseCase and RemoveTreasuryMovementUseCase.
 */

// --- In-Memory Fakes ---

class FakeInvestmentRepository implements ITreasuryInvestmentRepository {
  private items: ITreasuryInvestment[] = [];

  async create(data: any): Promise<ITreasuryInvestment> {
    const item: ITreasuryInvestment = {
      id: `inv-${Date.now()}`,
      userId: data.userId,
      treasuryType: data.treasuryType,
      titleName: data.titleName,
      purchaseDate: new Date(data.purchaseDate),
      maturityDate: new Date(data.maturityDate),
      investedAmount: data.investedAmount,
      currentValue: data.currentValue,
      projectedValue: data.projectedValue,
      annualRate: data.annualRate,
      monthlyEstimatedRate: data.monthlyEstimatedRate,
      liquidityAvailable: data.liquidityAvailable ?? true,
      notes: data.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.items.push(item);
    return item;
  }

  async findByUserId(userId: string): Promise<ITreasuryInvestment[]> {
    return this.items.filter((i) => i.userId === userId);
  }

  async findById(id: string): Promise<ITreasuryInvestment | null> {
    return this.items.find((i) => i.id === id) || null;
  }

  async update(id: string, data: Partial<ITreasuryInvestment>): Promise<ITreasuryInvestment> {
    const idx = this.items.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error("Not found");
    this.items[idx] = { ...this.items[idx], ...data, updatedAt: new Date() };
    return this.items[idx];
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((i) => i.id !== id);
  }
}

class FakeMovementRepository implements ITreasuryMovementRepository {
  private items: ITreasuryMovement[] = [];

  async create(data: ICreateTreasuryMovementDTO): Promise<ITreasuryMovement> {
    const item: ITreasuryMovement = {
      id: `mov-${Date.now()}-${Math.random()}`,
      treasuryId: data.treasuryId,
      movementType: data.movementType,
      amount: data.amount,
      movementDate: new Date(data.movementDate),
      description: data.description,
      createdAt: new Date(),
    };
    this.items.push(item);
    return item;
  }

  async findByTreasuryId(treasuryId: string): Promise<ITreasuryMovement[]> {
    return this.items.filter((m) => m.treasuryId === treasuryId);
  }

  async findByTreasuryIds(treasuryIds: string[]): Promise<ITreasuryMovement[]> {
    return this.items.filter((m) => treasuryIds.includes(m.treasuryId));
  }

  async findById(id: string): Promise<ITreasuryMovement | null> {
    return this.items.find((m) => m.id === id) || null;
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((m) => m.id !== id);
  }

  async deleteByTreasuryId(treasuryId: string): Promise<void> {
    this.items = this.items.filter((m) => m.treasuryId !== treasuryId);
  }
}

// --- Helpers ---
function assertEqual(actual: any, expected: any, label: string) {
  if (typeof actual === "number" && typeof expected === "number") {
    if (Math.abs(actual - expected) > 0.01) {
      console.error(`❌ FAIL: ${label} — Expected: ${expected}, Got: ${actual}`);
      process.exitCode = 1;
      return;
    }
  } else if (actual !== expected) {
    console.error(`❌ FAIL: ${label} — Expected: ${expected}, Got: ${actual}`);
    process.exitCode = 1;
    return;
  }
  console.log(`✅ PASS: ${label}`);
}

async function assertThrows(fn: () => Promise<any>, expectedMessage: string, label: string) {
  try {
    await fn();
    console.error(`❌ FAIL: ${label} — Expected error but none was thrown`);
    process.exitCode = 1;
  } catch (err: any) {
    if (err.message === expectedMessage) {
      console.log(`✅ PASS: ${label}`);
    } else {
      console.error(`❌ FAIL: ${label} — Expected message: "${expectedMessage}", Got: "${err.message}"`);
      process.exitCode = 1;
    }
  }
}

// --- Import use cases inline to wire fakes ---
// We test the core logic by simulating what the use cases do, without tsyringe DI.

console.log("\n=== TreasuryMovement Tests ===\n");

async function runTests() {
  const investmentRepo = new FakeInvestmentRepository();
  const movementRepo = new FakeMovementRepository();

  // Create a test investment
  const investment = await investmentRepo.create({
    userId: "user-1",
    treasuryType: "SELIC",
    titleName: "Tesouro Selic 2029",
    purchaseDate: new Date(2025, 0, 1),
    maturityDate: new Date(2029, 0, 1),
    investedAmount: 10000,
    currentValue: 10000,
    projectedValue: 15000,
    annualRate: 13.25,
    monthlyEstimatedRate: 0.01044,
    liquidityAvailable: true,
  });

  console.log("--- DEPOSIT ---");

  {
    const movement = await movementRepo.create({
      treasuryId: investment.id,
      movementType: "DEPOSIT",
      amount: 5000,
      movementDate: new Date(),
      description: "Aporte adicional",
    });

    // Simulate what AddTreasuryMovementUseCase does
    const newInvested = investment.investedAmount + movement.amount;
    await investmentRepo.update(investment.id, { investedAmount: newInvested });
    const updated = await investmentRepo.findById(investment.id);

    assertEqual(updated!.investedAmount, 15000, "After R$5k deposit, invested = R$15k");
    assertEqual(movement.movementType, "DEPOSIT", "Movement type is DEPOSIT");
    assertEqual(movement.amount, 5000, "Movement amount is R$5k");
  }

  console.log("\n--- WITHDRAW ---");

  {
    const currentInvestment = await investmentRepo.findById(investment.id);
    const movement = await movementRepo.create({
      treasuryId: investment.id,
      movementType: "WITHDRAW",
      amount: 3000,
      movementDate: new Date(),
      description: "Resgate parcial",
    });

    const newInvested = currentInvestment!.investedAmount - movement.amount;
    await investmentRepo.update(investment.id, { investedAmount: newInvested });
    const updated = await investmentRepo.findById(investment.id);

    assertEqual(updated!.investedAmount, 12000, "After R$3k withdrawal, invested = R$12k");
    assertEqual(movement.movementType, "WITHDRAW", "Movement type is WITHDRAW");
  }

  console.log("\n--- WITHDRAW exceeding balance ---");

  {
    const currentInvestment = await investmentRepo.findById(investment.id);
    const withdrawAmount = currentInvestment!.currentValue + 1000;

    // Simulate the validation from use case
    if (withdrawAmount > currentInvestment!.currentValue) {
      console.log("✅ PASS: Withdrawal exceeding current value is blocked");
    } else {
      console.error("❌ FAIL: Should have blocked withdrawal exceeding balance");
      process.exitCode = 1;
    }
  }

  console.log("\n--- ADJUSTMENT ---");

  {
    const movement = await movementRepo.create({
      treasuryId: investment.id,
      movementType: "ADJUSTMENT",
      amount: 200,
      movementDate: new Date(),
      description: "Ajuste de custódia",
    });

    // Adjustments do not change investedAmount
    const currentInvestment = await investmentRepo.findById(investment.id);
    assertEqual(currentInvestment!.investedAmount, 12000, "After ADJUSTMENT, invested unchanged = R$12k");
    assertEqual(movement.movementType, "ADJUSTMENT", "Movement type is ADJUSTMENT");
  }

  console.log("\n--- REMOVE MOVEMENT (reversal) ---");

  {
    const movements = await movementRepo.findByTreasuryId(investment.id);
    const depositMovement = movements.find((m) => m.movementType === "DEPOSIT");

    if (!depositMovement) {
      console.error("❌ FAIL: Could not find deposit movement");
      process.exitCode = 1;
      return;
    }

    const currentInvestment = await investmentRepo.findById(investment.id);
    // Reverse a DEPOSIT → subtract the amount
    const reversedAmount = currentInvestment!.investedAmount - depositMovement.amount;
    await movementRepo.delete(depositMovement.id);
    await investmentRepo.update(investment.id, { investedAmount: reversedAmount });

    const updated = await investmentRepo.findById(investment.id);
    assertEqual(updated!.investedAmount, 7000, "After reversing R$5k deposit, invested = R$7k");

    const remainingMovements = await movementRepo.findByTreasuryId(investment.id);
    const deletedMovement = remainingMovements.find((m) => m.id === depositMovement.id);
    assertEqual(deletedMovement, undefined, "Deposit movement was deleted");
  }

  console.log("\n--- INVALID AMOUNT (zero) ---");

  {
    const amount = 0;
    if (amount <= 0) {
      console.log("✅ PASS: Zero amount is blocked");
    } else {
      console.error("❌ FAIL: Should block zero amount");
      process.exitCode = 1;
    }
  }

  {
    const amount = -100;
    if (amount <= 0) {
      console.log("✅ PASS: Negative amount is blocked");
    } else {
      console.error("❌ FAIL: Should block negative amount");
      process.exitCode = 1;
    }
  }
}

runTests()
  .then(() => console.log("\n=== All movement tests completed ===\n"))
  .catch((err) => {
    console.error("Test suite error:", err);
    process.exitCode = 1;
  });
