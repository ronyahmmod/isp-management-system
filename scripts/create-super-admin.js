import User from "../models/User.js";
import { hashPassword } from "../lib/auth.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error("Please add MONGODB_URI to .env.local");

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

async function createAdmin() {
  await connectDB();
  const email = "admin@isp.com";
  const password = "Admin@12345";

  const exists = await User.findOne({ email: email });
  if (exists) {
    console.log("Admin already exists!");
    process.exit(0);
  }
  const hashedPassword = await hashPassword(password);

  const admin = await User.create({
    name: "Munna Aziz",
    email,
    password: hashedPassword,
    role: "admin",
  });

  console.log("Super Admin Created");
  console.log(admin);
  process.exit(0);
}

createAdmin();
