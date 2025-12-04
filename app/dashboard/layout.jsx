import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Unauthorized from "../components/Unauthorized";
import ClientDashboardLayout from "./admin/ClientDashboardLayout";

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!session) return <Unauthorized message="Please login first." />;

  if (user.role !== "admin" && user.role !== "employee") {
    return <Unauthorized message="You are not allowed to access dashboard." />;
  }
  if (session?.user.status !== "active")
    return (
      <Unauthorized message="You are not active. Please contact with admin." />
    );

  return <ClientDashboardLayout user={user}>{children}</ClientDashboardLayout>;
}
