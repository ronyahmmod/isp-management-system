import { qstash } from "@/lib/upstash";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";

import { NextResponse } from "next/server";

async function triggerHandler(req) {
  await connectDB();
  const now = new Date();

  // 1. Get IDs of active customers due for billing
  const customers = await Customer.find({
    status: "active",
    nextBillingDate: { $lte: now },
  }).select("_id");

  // 2. Fan-out: Send a message for each customer to the worker
  const messages = customers.map((c) => ({
    url: `${process.env.APP_URL}/api/cron/billing/worker/${c._id}`,
    body: JSON.stringify({ customerId: c._id }),
    delay: 0,
  }));

  if (messages.length > 0) {
    await qstash.batch(messages);
  }
  return NextResponse.json({ success: true, triggered: customers.length });
}

export const POST = verifySignatureAppRouter(triggerHandler);
