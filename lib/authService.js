import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export async function getSessionRedirect() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.status !== "active") {
    redirect("/login"); // Immediate redirect for server components
  }
  return session;
}

export async function validateRole(allowedRoles) {
  const session = await getSessionRedirect();
  if (!allowedRoles.includes(session.user.role)) {
    // For server actions, throw error; for page redirect
    throw new Error("Forbidden: Missing required permissions.");
  }
  return session;
}
