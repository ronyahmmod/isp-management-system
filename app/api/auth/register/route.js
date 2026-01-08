import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();
    await connectDB();

    const exists = await User.findOne({ email });
    if (exists)
      return Response.json({ message: "Email already used" }, { status: 400 });
    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    return Response.json({ message: "User created", newUser }, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: error.message },
      {
        status: 500,
      }
    );
  }
}
