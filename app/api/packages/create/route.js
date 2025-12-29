import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Package from "@/models/Package";
import { requireEmployee } from "@/lib/requireEmployee";

export async function POST(req) {
  try {
    await requireEmployee();
    await connectDB();

    const data = await req.json();
    const newPackage = await Package.create(data);
    return NextResponse.json(
      { package: newPackage, message: "Package created successfully." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
