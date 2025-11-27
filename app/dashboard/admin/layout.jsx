import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1">
        <Topbar user={session.user} />
        <main className="p-6 text-gray-900 dark:text-gray-100">{children}</main>
      </div>
    </div>
  );
}
