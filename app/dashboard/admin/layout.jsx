import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ClientDashboardLayout from "./ClientDashboardLayout";

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  return <ClientDashboardLayout user={user}>{children}</ClientDashboardLayout>;
}
