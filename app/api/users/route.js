import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  await connectDB();
  const users = await User.find().lean();
  return NextResponse.json(users);
}
