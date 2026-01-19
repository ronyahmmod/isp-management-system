import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { generateSingleBill } from "@/lib/bill/billingLogic";
import { NextResponse } from "next/server";

async function workerHandler(req) {
  const { customerId } = await req.json();
  const result = await generateSingleBill(customerId);
  if (!result.success) {
    return NextResponse.json({ error: result.message }, { status: 400 });
  }
  return NextResponse.json({ message: "Bill generated successfully" });
}

export const POST = verifySignatureAppRouter(workerHandler);
