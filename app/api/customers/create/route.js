import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";
import { requireEmployee } from "@/lib/requireEmployee";

export async function POST(req) {
  try {
    await requireEmployee();
    await connectDB();

    const data = await req.json();
    console.log(data);

    const customer = await Customer.create(data);

    return NextResponse.json({ customer }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
