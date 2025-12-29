import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";
import Package from "@/models/Package";
import { requireEmployee } from "@/lib/requireEmployee";

export async function GET() {
  try {
    await requireEmployee();
    await connectDB();
    // console.log("HIT");

    const customers = await Customer.find()
      .populate("package")
      .sort({ createdAt: -1 });

    return NextResponse.json({ customers }, { status: 200 });
  } catch (err) {
    console.log(err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
