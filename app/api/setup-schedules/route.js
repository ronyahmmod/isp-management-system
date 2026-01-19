import { qstash, getFullUrl } from "@/lib/upstash";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    // 1. Clear existing schedules to avoid duplicates (optional)
    const existing = await qstash.schedules.list();
    for (const s of existing) {
      await qstash.schedules.delete(s.scheduleId);
    }

    // 2. Create the Daily Billing Schedule (8 PM)
    await qstash.schedules.create({
      destination: getFullUrl("/api/cron/billing"),
      cron: "0 20 * * *",
    });

    return NextResponse.json({ message: "Schedules initialized successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
