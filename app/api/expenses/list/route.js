import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Expense from "@/models/Expense";
import { requireEmployee } from "@/lib/requireEmployee";

export async function GET() {
  try {
    requireEmployee();
    await connectDB();
    const expenses = await Expense.find().sort("-createdAt");
    return NextResponse.json({ expenses }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
