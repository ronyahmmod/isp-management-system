// lib/finance.js
import { connectDB } from "@/lib/db";
import { requireEmployee } from "@/lib/requireEmployee";
import Billing from "@/models/Billing";
import Expense from "@/models/Expense";
import Salary from "@/models/Salary";

export async function getFinancialSummary(startDate, endDate) {
  await requireEmployee();
  await connectDB();
  const query = { createdAt: { $gte: startDate, $lte: endDate } };

  // 1. Total Credits (Revenue from Paid Bills)
  const totalRevenue = await Billing.aggregate([
    { $match: { ...query, status: "paid" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  // 2. Total Debits (Expenses + Paid Salaries)
  const totalExpenses = await Expense.aggregate([
    { $match: query },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const totalSalaries = await Salary.aggregate([
    { $match: { ...query, status: "paid" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const income = totalRevenue[0]?.total || 0;
  const expense =
    (totalExpenses[0]?.total || 0) + (totalSalaries[0]?.total || 0);

  return {
    income,
    expense,
    netFund: income - expense,
  };
}
