import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardRedirect() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
  // const role = session.user.role;
  // switch (role) {
  //   case "admin":
  //     redirect("/dashboard/admin");
  //   case "employee":
  //     redirect("/dashboard/employee");
  //   default:
  //     redirect("/dashboard/admin");
  // }
}
