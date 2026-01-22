import { qstash } from "@/lib/upstash";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";

import { NextResponse } from "next/server";

async function triggerHandler(req) {
  await connectDB();
  const now = new Date();

  //   Calculate the target date (exactly 3 days from today)
  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);
  threeDaysLater.setHours(0, 0, 0, 0);

  const endOfThreeDaysLater = new Date(threeDaysLater);
  endOfThreeDaysLater.setHours(23, 59, 59, 999);

  // Find customers with nextBillingDate within the next 3 days
  const reminderCustomers = await Customer.find({
    status: "active",
    nextBillingDate: {
      $gte: threeDaysLater,
      $lte: endOfThreeDaysLater,
    },
  }).populate("package");

  if (reminderCustomers.length > 0) {
    const emailPayloads = reminderCustomers.map((c) => ({
      from: "onboarding@resend.dev",
      to: c.email,
      subject: "Upcoming Bill Reminder",
      html: `<p>Dear ${c.name},</p><p>Your bill of ${
        c.package?.price
      } is due on ${c.nextBillingDate.toDateString()}. Please pay it on time.</p>`,
    }));

    await resend.batch.send(emailPayloads);
  }

  // 1. Get IDs of active customers due for billing
  const customers = await Customer.find({
    status: "active",
    nextBillingDate: { $lte: now },
  }).select("_id");

  // 2. Fan-out: Send a message for each customer to the worker
  const messages = customers.map((c) => ({
    url: `${process.env.APP_URL}/api/cron/billing/worker`,
    method: "POST",
    headers: { "content-Type": "application/json" },
    body: JSON.stringify({ customerId: c._id }),
    delay: 0,
  }));

  if (messages.length > 0) {
    await qstash.batch(messages);
  }
  return NextResponse.json({ success: true, triggered: customers.length });
}

export const POST = verifySignatureAppRouter(triggerHandler);
