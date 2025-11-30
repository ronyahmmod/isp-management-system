import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { requireAdmin } from "@/lib/checkAdmin";
import { userUpdateSchema } from "@/lib/validation/userSchema";
import { hashPassword } from "@/lib/auth";

export async function PUT(req) {
  try {
    await requireAdmin();
    await connectDB();

    const { id, ...data } = await req.json();
    const parsed = userUpdateSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.errors },
        { status: 400 }
      );
    }

    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    const user = await User.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.messa });
  }
}
