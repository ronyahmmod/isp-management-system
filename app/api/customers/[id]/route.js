import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";
import { requireEmployee } from "@/lib/requireEmployee";

export async function GET(req, ctx) {
  try {
    const params = await ctx.params;

    await requireEmployee();
    await connectDB();

    const customer = await Customer.findById(params.id);

    if (!customer)
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );

    return NextResponse.json({ customer });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
