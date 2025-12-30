import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireEmployee } from "@/lib/requireEmployee";
import Customer from "@/models/Customer";
import Billing from "@/models/Billing";
import Expense from "@/models/Expense";

export async function GET() {
  try {
    await requireEmployee();
    await connectDB();

    // 1. User Statistics
    const totalUsers = await Customer.countDocuments();
    const activeUsers = await Customer.countDocuments({ status: "active" });

    // 2. Financial Aggregation
    const billingStats = await Billing.aggregate([
      {
        $group: {
          _id: null,
          totalInvoiced: { $sum: "$amount" },
          totalCollected: {
            $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0] },
          },
          totalDue: {
            $sum: { $cond: [{ $ne: ["$status", "paid"] }, "$amount", 0] },
          },
        },
      },
    ]);

    const expenseStats = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const stats = billingStats[0] || {
      totalInvoiced: 0,
      totalCollected: 0,
      totalDue: 0,
    };
    const totalExpense = expenseStats[0]?.total || 0;

    return NextResponse.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
      },
      finance: {
        totalInvoiced: stats.totalInvoiced,
        totalCollected: stats.totalCollected,
        totalDue: stats.totalDue,
        totalExpense: totalExpense,
        netWorth: stats.totalCollected - totalExpense, // Actual Cash on Hand
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
