// lib/auth.js (or wherever requireAdmin is located)
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  // Check three conditions:
  // 1. Is there a session?
  // 2. Is the user role strictly "admin"?
  // 3. Is the user status strictly "active"?
  if (
    !session ||
    session.user.role !== "admin" ||
    session.user.status !== "active"
  ) {
    // You might want a more specific message depending on how you handle errors
    throw new Error("Unauthorized or account inactive");
  }
}
