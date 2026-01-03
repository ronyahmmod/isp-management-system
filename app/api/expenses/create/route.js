import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Expense from "@/models/Expense";
import { requireEmployee } from "@/lib/requireEmployee";

export async function POST(req) {
  try {
    await requireEmployee();
    await connectDB();

    const data = await req.json();
    const expense = await Expense.create(data);

    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
