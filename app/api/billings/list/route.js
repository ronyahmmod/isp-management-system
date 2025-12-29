import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Billing from "@/models/Billing";
import Customer from "@/models/Customer";
import Package from "@/models/Package";
import { requireEmployee } from "@/lib/requireEmployee";

export async function GET() {
  try {
    requireEmployee();
    await connectDB();
    console.log("HIT");
    const billings = await Billing.find()
      .populate("customer")
      .populate("package")
      .sort("-createdAt");

    return NextResponse.json({ billings }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
