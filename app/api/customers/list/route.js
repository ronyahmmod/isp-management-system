import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";
import { requireEmployee } from "@/lib/requireEmployee";

export async function GET() {
  try {
    await requireEmployee();
    await connectDB();

    const customers = await Customer.find().sort({ createdAt: -1 });

    return NextResponse.json({ customers }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
