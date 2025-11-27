import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/checkAdmin";

export async function PUT(req) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await req.json();
    const user = await User.findByIdAndUpdate(
      id,
      { status: "active" },
      { new: true }
    );
    return NextResponse.json(
      { message: "User activated", user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ errro: error.message }, { status: 500 });
  }
}
