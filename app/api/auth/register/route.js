import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json();
    await connectDB();

    const exists = await User.findOne({ email });
    if (exists)
      return new Response(JSON.stringify({ error: "Email already used" }), {
        status: 400,
      });
    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    return new Response(JSON.stringify({ message: "User created", newUser }));
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
