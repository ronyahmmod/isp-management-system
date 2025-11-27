// app/dashboard/admin/users/page.jsx
"use client";

import useUsers from "@/app/hooks/useUsers";

export default function UsersPage() {
  const { users, loading, error, mutate } = useUsers();

  async function deactivate(id) {
    await fetch("/api/users/deactivate", {
      method: "PUT",
      body: JSON.stringify({ id }),
    });
    mutate();
  }

  async function activate(id) {
    await fetch("/api/users/activate", {
      method: "PUT",
      body: JSON.stringify({ id }),
    });
    mutate();
  }

  if (loading) return <p className="text-center p-4">Loading...</p>;
  if (error) return <p className="text-red-500">Failed to load users.</p>;
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="p-2 text-left">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {users?.map((u) => (
            <tr key={u._id} className="border-b dark:border-gray-700">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2">
                {u.status === "active" && (
                  <span className="text-green-600">🟢 Active</span>
                )}
                {u.status === "deactivate" && (
                  <span className="text-red-500">🔴 Inactive</span>
                )}
              </td>

              <td className="p-2 flex gap-2">
                {u.status === "active" && (
                  <button
                    onClick={() => deactivate(u._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Deactivate
                  </button>
                )}

                {u.status === "deactivate" && (
                  <button
                    onClick={() => activate(u._id)}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                  >
                    Activate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
