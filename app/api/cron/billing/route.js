import { NextResponse } from "next/server";
import { generateMonthlyBilling } from "@/lib/bill/billingGenerator";

export async function GET() {
  try {
    const result = await generateMonthlyBilling();
    const data = await result.json();
    // console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error generating monthly billing:", error);
    return NextResponse.json(
      { error: "Failed to generate monthly billing" },
      { status: 500 }
    );
  }
}
