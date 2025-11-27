import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";
import { requireAdmin } from "@/lib/checkAdmin";
import { userCreateSchema } from "@/lib/validation/userSchema";

export async function POST(req) {
  try {
    await requireAdmin();
    await connectDB();
    const body = await req.json();
    const parsed = userCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: parsed.error.errors,
        },
        { status: 400 }
      );
    }

    const exists = await User.findOne({ email: body.email });

    if (exists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashed = await hashPassword(body.password);
    const user = await User.create({
      name: body.name,
      email: body.email,
      role: body.role,
      password: hashed,
    });

    return NextResponse.json(
      { message: "User created successfully", user },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
