import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";
import { requireEmployee } from "@/lib/requireEmployee";

export async function PUT(req) {
  try {
    await requireEmployee();
    await connectDB();

    const { id, status } = await req.json();

    const updated = await Customer.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    return NextResponse.json({ customer: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
