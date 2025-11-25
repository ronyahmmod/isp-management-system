import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { canAccess } from "@/lib/rbac";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!canAccess(session.user.role, ["admin"])) {
    return <h1 className="text-red-600 p-4">Access Denied</h1>;
  }
  return <h1 className="text-2xl p-4">Welcome Admin</h1>;
}
