import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardRedirect() {
  const session = await getServerSession(authOptions);
  console.log(session.user);
  if (!session) {
    redirect("/login");
  }
  const role = session.user.role;
  switch (role) {
    case "admin":
      redirect("/dashboard/admin");
    default:
      redirect("/dashboard/admin");
  }
}
