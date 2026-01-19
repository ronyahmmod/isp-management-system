import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function requireEmployee() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return { ok: false, message: "Not authenticated" };
  }

  const { role, status } = session.user;

  if (status !== "active") {
    return { ok: false, message: "Account inactive" };
  }

  // ALLOW employee + admin
  const allowedRoles = ["employee", "admin"];
  if (!allowedRoles.includes(role)) {
    return { ok: false, message: "Not authorized" };
  }

  return { ok: true, session, user: session.user };
}
