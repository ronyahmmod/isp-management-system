// lib/finance.js
import { connectDB } from "@/lib/db";
import { requireEmployee } from "@/lib/requireEmployee";

import Billing from "@/models/Billing";
import Expense from "@/models/Expense";
import Salary from "@/models/Salary";

export async function getFinancialSummary(start, end) {
  await requireEmployee();
  await connectDB();

  const query = { createdAt: { $gte: start, $lte: end } };
  const expenseQuery = { date: { $gte: start, $lte: end } };

  const [revenue, expenses, salaries] = await Promise.all([
    Billing.aggregate([
      { $match: { ...query, status: "paid" } },
      { $group: { _id: null, t: { $sum: "$amount" } } },
    ]),
    Expense.aggregate([
      { $match: expenseQuery },
      { $group: { _id: null, t: { $sum: "$amount" } } },
    ]),
    Salary.aggregate([
      { $match: { ...query, status: "paid" } },
      { $group: { _id: null, t: { $sum: "$amount" } } },
    ]),
  ]);

  const income = revenue[0]?.t || 0;
  const officeExpense = expenses[0]?.t || 0;
  const salaryExpense = salaries[0]?.t || 0;

  return {
    income,
    salaryExpense,
    officeExpense,
    totalExpense: officeExpense + salaryExpense,
    netFund: income - (officeExpense + salaryExpense),
  };
}
