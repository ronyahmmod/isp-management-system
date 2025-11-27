// components/tables/UsersTable.client.jsx
"use client";
import { useState } from "react";

export default function UsersTable({ users = [], onDeleted = () => {} }) {
  const [loadingId, setLoadingId] = useState(null);

  async function handleDelete(id) {
    if (!confirm("Delete this user?")) return;
    setLoadingId(id);
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    setLoadingId(null);
    onDeleted();
  }

  return (
    <table className="w-full table-auto">
      <thead>
        <tr className="text-left text-sm text-gray-600">
          <th className="p-2">Name</th>
          <th className="p-2">Email</th>
          <th className="p-2">Role</th>
          <th className="p-2">Status</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u._id} className="border-t">
            <td className="p-2">{u.name}</td>
            <td className="p-2">{u.email}</td>
            <td className="p-2">{u.role}</td>
            <td className="p-2">{u.status || "active"}</td>
            <td className="p-2">
              <button className="mr-2 px-2 py-1 text-sm bg-blue-600 text-white rounded">
                Edit
              </button>
              <button
                onClick={() => handleDelete(u._id)}
                className="px-2 py-1 text-sm bg-red-600 text-white rounded"
              >
                {loadingId === u._id ? "Deleting..." : "Delete"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
