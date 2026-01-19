import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";
import { requireEmployee } from "@/lib/requireEmployee";

export async function POST(req) {
  try {
    const { user } = await requireEmployee();
    // console.log(user);
    await connectDB();

    const data = await req.json();
    // console.log({ ...data, createdBy: user._id });
    const customer = await Customer.create({ ...data, createdBy: user.id });

    return NextResponse.json({ customer, success: true }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
