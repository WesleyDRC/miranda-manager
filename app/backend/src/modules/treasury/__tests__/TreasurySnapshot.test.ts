import { ITreasuryInvestment } from "@/modules/treasury/entities/ITreasuryInvestment";
import { ITreasurySnapshot } from "@/modules/treasury/entities/ITreasurySnapshot";
import { ITreasuryInvestmentRepository } from "@/modules/treasury/repositories/ITreasuryInvestmentRepository";
import { ITreasurySnapshotRepository } from "@/modules/treasury/repositories/ITreasurySnapshotRepository";
import { ICreateTreasurySnapshotDTO } from "@/modules/treasury/dtos/ICreateTreasurySnapshotDTO";

/**
 * Unit tests for snapshot business logic.
 *
 * Run with: npx ts-node -r tsconfig-paths/register src/modules/treasury/__tests__/TreasurySnapshot.test.ts
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

class FakeSnapshotRepository implements ITreasurySnapshotRepository {
  private items: ITreasurySnapshot[] = [];

  async create(data: ICreateTreasurySnapshotDTO): Promise<ITreasurySnapshot> {
    const item: ITreasurySnapshot = {
      id: `snap-${Date.now()}-${Math.random()}`,
      treasuryId: data.treasuryId,
      snapshotDate: new Date(data.snapshotDate),
      currentValue: data.currentValue,
      projectedValue: data.projectedValue,
      createdAt: new Date(),
    };
    this.items.push(item);
    return item;
  }

  async findByTreasuryId(treasuryId: string): Promise<ITreasurySnapshot[]> {
    return this.items
      .filter((s) => s.treasuryId === treasuryId)
      .sort((a, b) => b.snapshotDate.getTime() - a.snapshotDate.getTime());
  }

  async findById(id: string): Promise<ITreasurySnapshot | null> {
    return this.items.find((s) => s.id === id) || null;
  }

  async deleteByTreasuryId(treasuryId: string): Promise<void> {
    this.items = this.items.filter((s) => s.treasuryId !== treasuryId);
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

console.log("\n=== TreasurySnapshot Tests ===\n");

import { TreasuryCalculationService } from "@/modules/treasury/services/TreasuryCalculationService";

async function runTests() {
  const investmentRepo = new FakeInvestmentRepository();
  const snapshotRepo = new FakeSnapshotRepository();

  // Create investment
  const purchaseDate = new Date(2025, 0, 1);
  const maturityDate = new Date(2030, 0, 1);
  const investedAmount = 10000;
  const annualRate = 10;

  const investment = await investmentRepo.create({
    userId: "user-1",
    treasuryType: "PREFIXADO",
    titleName: "Tesouro Prefixado 2030",
    purchaseDate,
    maturityDate,
    investedAmount,
    currentValue: investedAmount,
    projectedValue: TreasuryCalculationService.calculateProjectedValue(investedAmount, annualRate, purchaseDate, maturityDate),
    annualRate,
    monthlyEstimatedRate: TreasuryCalculationService.annualToMonthlyRate(annualRate),
    liquidityAvailable: true,
  });

  console.log("--- CREATE SNAPSHOT ---");

  {
    // Simulate CreateSnapshotUseCase running 6 months after purchase
    const snapshotDate = new Date(2025, 6, 1);
    
    const currentValue = TreasuryCalculationService.calculateCurrentValue(
      investment.investedAmount,
      investment.annualRate,
      investment.purchaseDate,
      snapshotDate
    );

    const snapshot = await snapshotRepo.create({
      treasuryId: investment.id,
      snapshotDate,
      currentValue,
      projectedValue: investment.projectedValue,
    });

    // Investment gets updated with new values
    await investmentRepo.update(investment.id, {
      currentValue,
      projectedValue: investment.projectedValue,
    });

    const updatedInvestment = await investmentRepo.findById(investment.id);

    // After 6 months at 10% a.a (approx 0.797% a.m.) -> 10000 * 1.0488
    assertEqual(snapshot.currentValue > 10400 && snapshot.currentValue < 10500, true, "Snapshot current value calculated for 6 months (approx 10,488)");
    assertEqual(updatedInvestment!.currentValue, snapshot.currentValue, "Investment current value is updated to match snapshot");
    
    const snapshots = await snapshotRepo.findByTreasuryId(investment.id);
    assertEqual(snapshots.length, 1, "There is 1 snapshot recorded");
    assertEqual(snapshots[0].id, snapshot.id, "Snapshot correctly retrieved by treasuryId");
  }

  console.log("\n--- DELETE CASCADE ---");

  {
    // Simulate deleting the investment cascading to snapshots
    await snapshotRepo.deleteByTreasuryId(investment.id);
    await investmentRepo.delete(investment.id);

    const remainingSnapshots = await snapshotRepo.findByTreasuryId(investment.id);
    assertEqual(remainingSnapshots.length, 0, "Snapshots are deleted when cascaded by treasuryId");
  }

}

runTests()
  .then(() => console.log("\n=== All snapshot tests completed ===\n"))
  .catch((err) => {
    console.error("Test suite error:", err);
    process.exitCode = 1;
  });
