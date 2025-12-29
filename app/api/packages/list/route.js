import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Package from "@/models/Package";
import { requireEmployee } from "@/lib/requireEmployee";

export async function GET() {
  try {
    await requireEmployee();
    await connectDB();
    const packages = await Package.find().sort({ createdAt: -1 });
    // console.log(packages);
    return NextResponse.json({ packages }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
