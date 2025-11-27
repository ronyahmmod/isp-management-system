import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { requireAdmin } from "@/lib/checkAdmin";

export async function PUT(req) {
  try {
    await requireAdmin();
    await connectDB();

    const { id } = await req.json();
    const user = await User.findByIdAndUpdate(
      id,
      { status: "deactivate" },
      { new: true }
    );
    return NextResponse.json(
      { message: "User deactivated", user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
