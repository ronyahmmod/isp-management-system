import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
export default async function EmployeeDashboard() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  return (
    <div>
      <h1>Welcome {user.name}</h1>
    </div>
  );
}
