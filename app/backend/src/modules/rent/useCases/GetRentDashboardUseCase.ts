import { inject, injectable } from "tsyringe";

import { IUseCase } from "./ports/IUseCase";
import { IRentRepository } from "../repositories/IRentRepository";
import { IRent } from "../entities/IRent";
import { IRentMonth } from "../entities/IRentMonth";
import { formatDateToDDMMYY } from "../../../shared/utils/formatDateToDDMMYY";

const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

@injectable()
export class GetRentDashboardUseCase implements IUseCase {
  constructor(
    @inject("RentRepository")
    private rentRepository: IRentRepository
  ) {}

  async execute({ userId }: { userId: string }): Promise<any> {
    const rents = await this.rentRepository.findAll(userId);

    // Auto-fill missing months for all rents to ensure stats are accurate
    const rentsWithMonths = await Promise.all(
      rents.map(async (rent) => {
        const months = await this.fillMissingMonths(rent);
        return {
          ...rent,
          months,
        };
      })
    );

    // Gather all month IDs for bulk loading
    const allMonthIds: string[] = [];
    rentsWithMonths.forEach((rent) => {
      if (rent.months) {
        rent.months.forEach((month) => {
          if (month.id) allMonthIds.push(month.id);
        });
      }
    });

    // Fetch payments, expenses, receipts in bulk
    const payments = await this.rentRepository.findRentPaymentsByMonthIds(allMonthIds);
    const expenses = await this.rentRepository.findRentExpensesByMonthIds(allMonthIds);
    const receipts = await this.rentRepository.findRentReceiptsByMonthIds(allMonthIds);

    // Map bulk lists to helper lookup maps by rentMonthId
    const paymentsMap = new Map<string, any[]>();
    const expensesMap = new Map<string, any[]>();
    const receiptsMap = new Map<string, any[]>();

    payments.forEach((payment) => {
      const list = paymentsMap.get(payment.rentMonthId) || [];
      list.push(payment);
      paymentsMap.set(payment.rentMonthId, list);
    });

    expenses.forEach((expense) => {
      const list = expensesMap.get(expense.rentMonthId) || [];
      list.push(expense);
      expensesMap.set(expense.rentMonthId, list);
    });

    receipts.forEach((receipt) => {
      const list = receiptsMap.get(receipt.rentMonthId) || [];
      list.push(receipt);
      receiptsMap.set(receipt.rentMonthId, list);
    });

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthIndex = now.getMonth(); // 0-11

    let totalReceivedThisMonth = 0;
    let totalPendingThisMonth = 0;
    let defaultingTenantsCount = 0;
    let expectedIncomeNextMonth = 0;
    const totalPropertiesRented = rentsWithMonths.length;
    let expectedAnnualRevenue = 0;
    let totalOpenValue = 0;
    let totalGrossIncome = 0;
    let totalNetIncome = 0;

    // We will aggregate monthly data for charts (last 12 months)
    const last12MonthsSeries = Array.from({ length: 12 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return {
        monthKey: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        name: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`,
        recebido: 0,
        previsto: 0,
      };
    });

    const detailedRentals = rentsWithMonths.map((rent) => {
      const rentValue = parseFloat(rent.value) || 0;
      expectedIncomeNextMonth += rentValue;
      expectedAnnualRevenue += rentValue * 12;
      totalGrossIncome += rent.grossIncome || 0;
      totalNetIncome += rent.netIncome || 0;

      let rentTotalPaid = 0;
      let rentTotalDebt = 0;
      let hasOverdueMonth = false;
      let hasPendingMonth = false;
      let lastPaymentDate: Date | null = null;
      let nextDue: string | null = null;

      const mappedMonths = (rent.months || []).map((month) => {
        const monthDate = new Date(month.dateMonth);
        const mPayments = paymentsMap.get(month.id) || [];
        const mExpenses = expensesMap.get(month.id) || [];
        const mReceipts = receiptsMap.get(month.id) || [];

        const monthPaidAmount = month.amountPaid || 0;
        rentTotalPaid += monthPaidAmount;

        const isCurrentMonthObj =
          monthDate.getMonth() === currentMonthIndex &&
          monthDate.getFullYear() === currentYear;

        // Find last payment date
        mPayments.forEach((p) => {
          const pDate = new Date(p.paymentDate);
          if (!lastPaymentDate || pDate > lastPaymentDate) {
            lastPaymentDate = pDate;
          }
          // Sum payments in current calendar month for general KPI
          if (pDate.getMonth() === currentMonthIndex && pDate.getFullYear() === currentYear) {
            totalReceivedThisMonth += p.amount;
          }
          // Aggregate historical chart received data
          const pMonthKey = `${pDate.getFullYear()}-${String(pDate.getMonth() + 1).padStart(2, "0")}`;
          const match = last12MonthsSeries.find((s) => s.monthKey === pMonthKey);
          if (match) {
            match.recebido += p.amount;
          }
        });

        // Add to historical chart expected data
        const mMonthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`;
        const matchExpected = last12MonthsSeries.find((s) => s.monthKey === mMonthKey);
        if (matchExpected) {
          matchExpected.previsto += rentValue;
        }

        const isPaid = month.paid;
        const outstanding = rentValue - monthPaidAmount;

        if (!isPaid) {
          totalOpenValue += outstanding;

          if (isCurrentMonthObj) {
            totalPendingThisMonth += outstanding;
          }

          // A month is overdue if its date is in the past
          if (monthDate < now) {
            hasOverdueMonth = true;
          } else {
            hasPendingMonth = true;
          }

          rentTotalDebt += outstanding;

          if (!nextDue) {
            nextDue = formatDateToDDMMYY(monthDate);
          }
        }

        return {
          id: month.id,
          dateMonth: formatDateToDDMMYY(monthDate),
          amountPaid: monthPaidAmount,
          paid: isPaid,
          difference: outstanding,
          receipt: mReceipts,
          expenses: mExpenses,
          payments: mPayments,
        };
      });

      // Sort months chronologically for the detailed list
      mappedMonths.sort((a, b) => {
        const [da, ma, ya] = a.dateMonth.split("/").map(Number);
        const [db, mb, yb] = b.dateMonth.split("/").map(Number);
        return new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db).getTime();
      });

      let status = "Pago";
      if (hasOverdueMonth) {
        status = "Atrasado";
        defaultingTenantsCount++;
      } else if (hasPendingMonth || mappedMonths.some(m => !m.paid)) {
        status = "Pendente";
      }

      return {
        id: rent.id,
        tenant: rent.tenant,
        value: rent.value,
        street: rent.street,
        streetNumber: rent.streetNumber,
        startRental: rent.startRental,
        grossIncome: rent.grossIncome,
        netIncome: rent.netIncome,
        observations: rent.observations || "",
        totalPaid: rentTotalPaid,
        totalDebt: rentTotalDebt,
        status,
        lastPaymentDate: lastPaymentDate ? formatDateToDDMMYY(lastPaymentDate) : "—",
        nextDue: nextDue || "—",
        months: mappedMonths,
      };
    });

    const delinquencyRate = totalPropertiesRented > 0
      ? parseFloat(((defaultingTenantsCount / totalPropertiesRented) * 100).toFixed(1))
      : 0;

    // Pie chart data
    const totalPaidAllTime = detailedRentals.reduce((sum, r) => sum + r.totalPaid, 0);
    const totalDebtAllTime = detailedRentals.reduce((sum, r) => sum + r.totalDebt, 0);

    const delinquencyPieData = [
      { name: "Pago", value: totalPaidAllTime },
      { name: "Em Aberto", value: totalDebtAllTime },
    ];

    // Forecast for the next 6 months
    const forecastSeries = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() + 1 + i, 1);
      return {
        name: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`,
        previsto: expectedIncomeNextMonth,
      };
    });

    // Revenue by Property series
    const revenueByPropertySeries = detailedRentals.map((r) => ({
      property: `${r.street}, ${r.streetNumber}`,
      tenant: r.tenant,
      recebido: r.totalPaid,
      previsto: (r.months || []).length * (parseFloat(r.value) || 0),
    })).sort((a, b) => b.recebido - a.recebido);

    return {
      summary: {
        totalReceivedThisMonth,
        totalPendingThisMonth,
        defaultingTenantsCount,
        expectedIncomeNextMonth,
        totalPropertiesRented,
        delinquencyRate,
        expectedAnnualRevenue,
        totalOpenValue,
        totalGrossIncome,
        totalNetIncome,
      },
      rentals: detailedRentals,
      charts: {
        monthlyRevenue: last12MonthsSeries,
        delinquency: delinquencyPieData,
        forecast: forecastSeries,
        propertyRevenue: revenueByPropertySeries,
      },
    };
  }

  private async fillMissingMonths(rent: IRent): Promise<IRentMonth[]> {
    const rentMonths = await this.rentRepository.findAllRentMonthByRentId(rent.id);
    const [day, month, year] = rent.startRental.split("/").map(Number);

    const sortedMonths = [...rentMonths].sort(
      (a, b) => new Date(a.dateMonth).getTime() - new Date(b.dateMonth).getTime()
    );

    const currentDate = new Date();
    // End date is the due day in the current calendar month
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

    let lastDate: Date;
    if (sortedMonths.length > 0) {
      lastDate = new Date(sortedMonths[sortedMonths.length - 1].dateMonth);
    } else {
      lastDate = new Date(year, month - 1, day);
    }

    const nextDate = new Date(lastDate);
    if (sortedMonths.length > 0) {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else {
      // Create first month if it doesn't exist
      const firstMonth = await this.rentRepository.createRentMonth({
        dateMonth: new Date(lastDate),
        rentId: rent.id,
      });
      sortedMonths.push(firstMonth);
      nextDate.setMonth(nextDate.getMonth() + 1);
    }

    const newMonths: IRentMonth[] = [];
    for (let date = new Date(nextDate); date <= endDate; date.setMonth(date.getMonth() + 1)) {
      // Double check if a month with the same year and month already exists to avoid duplicates
      const exists = sortedMonths.some(
        (m) =>
          new Date(m.dateMonth).getMonth() === date.getMonth() &&
          new Date(m.dateMonth).getFullYear() === date.getFullYear()
      );

      if (!exists) {
        const created = await this.rentRepository.createRentMonth({
          dateMonth: new Date(date),
          rentId: rent.id,
        });
        newMonths.push(created);
      }
    }

    return [...sortedMonths, ...newMonths];
  }
}
