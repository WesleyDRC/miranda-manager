import { TreasuryCalculationService } from "@/modules/treasury/services/TreasuryCalculationService";

/**
 * Unit tests for TreasuryCalculationService.
 * 
 * Run with: npx ts-node -r tsconfig-paths/register src/modules/treasury/__tests__/TreasuryCalculationService.test.ts
 */

function assertEqual(actual: number, expected: number, tolerance: number, label: string) {
  const diff = Math.abs(actual - expected);
  if (diff > tolerance) {
    console.error(`❌ FAIL: ${label}`);
    console.error(`   Expected: ${expected}, Got: ${actual}, Diff: ${diff}, Tolerance: ${tolerance}`);
    process.exitCode = 1;
  } else {
    console.log(`✅ PASS: ${label}`);
  }
}

function assertStrictEqual(actual: any, expected: any, label: string) {
  if (actual !== expected) {
    console.error(`❌ FAIL: ${label}`);
    console.error(`   Expected: ${expected}, Got: ${actual}`);
    process.exitCode = 1;
  } else {
    console.log(`✅ PASS: ${label}`);
  }
}

console.log("\n=== TreasuryCalculationService Tests ===\n");

// --- annualToMonthlyRate ---
console.log("--- annualToMonthlyRate ---");

{
  // 12% a.a. should give approximately 0.9489% a.m.
  const rate = TreasuryCalculationService.annualToMonthlyRate(12);
  assertEqual(rate, 0.009489, 0.0001, "12% a.a. → ~0.9489% a.m.");
}

{
  // 0% a.a. should give 0% a.m.
  const rate = TreasuryCalculationService.annualToMonthlyRate(0);
  assertStrictEqual(rate, 0, "0% a.a. → 0% a.m.");
}

{
  // 100% a.a. should give approximately 5.946% a.m.
  const rate = TreasuryCalculationService.annualToMonthlyRate(100);
  assertEqual(rate, 0.05946, 0.001, "100% a.a. → ~5.946% a.m.");
}

// --- monthsBetween ---
console.log("\n--- monthsBetween ---");

{
  const months = TreasuryCalculationService.monthsBetween(
    new Date(2025, 0, 1), // Jan 1
    new Date(2026, 0, 1)  // Jan 1 next year
  );
  assertEqual(months, 12, 0.1, "Jan 2025 to Jan 2026 = 12 months");
}

{
  const months = TreasuryCalculationService.monthsBetween(
    new Date(2025, 0, 1),
    new Date(2025, 6, 1)
  );
  assertEqual(months, 6, 0.1, "Jan to Jul 2025 = 6 months");
}

{
  const months = TreasuryCalculationService.monthsBetween(
    new Date(2025, 0, 1),
    new Date(2025, 0, 1)
  );
  assertEqual(months, 0, 0.01, "Same date = 0 months");
}

// --- calculateProjectedValue ---
console.log("\n--- calculateProjectedValue ---");

{
  // R$ 10,000 at 12% a.a. for 12 months → R$ 11,200 (compound)
  const projected = TreasuryCalculationService.calculateProjectedValue(
    10000,
    12,
    new Date(2025, 0, 1),
    new Date(2026, 0, 1)
  );
  assertEqual(projected, 11200, 50, "R$10k at 12% for 1 year ≈ R$11,200");
}

{
  // R$ 5,000 at 0% for 24 months → R$ 5,000
  const projected = TreasuryCalculationService.calculateProjectedValue(
    5000,
    0,
    new Date(2025, 0, 1),
    new Date(2027, 0, 1)
  );
  assertEqual(projected, 5000, 0.01, "R$5k at 0% for 2 years = R$5,000");
}

{
  // R$ 1,000 at 15% a.a. for 5 years
  const projected = TreasuryCalculationService.calculateProjectedValue(
    1000,
    15,
    new Date(2025, 0, 1),
    new Date(2030, 0, 1)
  );
  // (1.15)^5 = 2.01136
  assertEqual(projected, 2011.36, 10, "R$1k at 15% for 5 years ≈ R$2,011");
}

// --- calculateCurrentValue ---
console.log("\n--- calculateCurrentValue ---");

{
  // Purchase today, reference today → same as invested
  const now = new Date();
  const value = TreasuryCalculationService.calculateCurrentValue(10000, 12, now, now);
  assertEqual(value, 10000, 1, "Purchase today = invested amount");
}

{
  // R$ 10,000 at 12% a.a., purchased 6 months ago
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const value = TreasuryCalculationService.calculateCurrentValue(
    10000, 12, sixMonthsAgo, new Date()
  );
  // After 6 months at ~0.95% monthly: 10000 * (1.0095)^6 ≈ 10,582
  assertEqual(value, 10582, 50, "R$10k at 12% after 6 months ≈ R$10,582");
}

// --- getIRRate ---
console.log("\n--- getIRRate (Regressive IR Table) ---");

{
  assertStrictEqual(TreasuryCalculationService.getIRRate(30), 0.225, "30 days → 22.5%");
  assertStrictEqual(TreasuryCalculationService.getIRRate(180), 0.225, "180 days → 22.5%");
  assertStrictEqual(TreasuryCalculationService.getIRRate(181), 0.20, "181 days → 20%");
  assertStrictEqual(TreasuryCalculationService.getIRRate(360), 0.20, "360 days → 20%");
  assertStrictEqual(TreasuryCalculationService.getIRRate(361), 0.175, "361 days → 17.5%");
  assertStrictEqual(TreasuryCalculationService.getIRRate(720), 0.175, "720 days → 17.5%");
  assertStrictEqual(TreasuryCalculationService.getIRRate(721), 0.15, "721 days → 15%");
  assertStrictEqual(TreasuryCalculationService.getIRRate(1000), 0.15, "1000 days → 15%");
}

// --- calculateIncomeTax ---
console.log("\n--- calculateIncomeTax ---");

{
  // R$ 1,000 gross yield, held 100 days → 22.5%
  const tax = TreasuryCalculationService.calculateIncomeTax(
    1000,
    new Date(2025, 0, 1),
    new Date(2025, 3, 11) // ~100 days
  );
  assertEqual(tax, 225, 1, "R$1k yield at 22.5% → R$225 tax");
}

{
  // Negative yield → no tax
  const tax = TreasuryCalculationService.calculateIncomeTax(
    -500,
    new Date(2025, 0, 1),
    new Date(2025, 6, 1)
  );
  assertStrictEqual(tax, 0, "Negative yield → R$0 tax");
}

// --- calculateGrossYield ---
console.log("\n--- calculateGrossYield ---");

{
  const yield_ = TreasuryCalculationService.calculateGrossYield(10000, 11200);
  assertStrictEqual(yield_, 1200, "R$10k invested, R$11.2k current → R$1.2k yield");
}

// --- calculateNetValue ---
console.log("\n--- calculateNetValue ---");

{
  // R$ 10,000 invested, now worth R$ 11,000 after 400 days → 17.5% IR on R$1,000 yield
  const purchaseDate = new Date(2024, 0, 1);
  const referenceDate = new Date(2025, 1, 5); // ~400 days
  const net = TreasuryCalculationService.calculateNetValue(10000, 11000, purchaseDate, referenceDate);
  // Tax = 1000 * 0.175 = 175, Net = 11000 - 175 = 10825
  assertEqual(net, 10825, 1, "R$10k→R$11k after 400d: net ≈ R$10,825");
}

console.log("\n=== All tests completed ===\n");
