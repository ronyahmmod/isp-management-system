// app/dashboard/admin/users/page.jsx
"use client";

import useUsers from "@/app/hooks/useUsers";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link for navigation
import TableSkeleton from "@/app/components/TableSkeleton";
import { CheckCircle, Edit2, PlusCircle, Power } from "lucide-react";
import DataTable from "@/app/components/DataTable";

export default function UsersPage() {
  const router = useRouter();
  const { users, loading, error, mutate } = useUsers();

  // --- Client-side pagination and filtering state ---

  async function deactivate(id) {
    await fetch("/api/users/deactivate", {
      method: "PUT",
      body: JSON.stringify({ id }),
    });
    mutate();
  }

  const handleEdit = (id) => {
    router.push(`/dashboard/admin/users/edit/${id}`);
  };

  async function activate(id) {
    await fetch("/api/users/activate", {
      method: "PUT",
      body: JSON.stringify({ id }),
    });
    mutate();
  }

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    {
      header: "Role",
      accessor: "role",
      cell: (row) => (row.role === "admin" ? "Admin" : "User"),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) =>
        row.status === "active" ? (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Active
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            Inactive
          </span>
        ),
    },
    {
      header: "User Created At",
      accessor: "createdAt",
      cell: (row) => {
        const date = new Date(row.createdAt);
        return date.toLocaleDateString();
      },
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row._id)}
            className="text-blue-500 hover:text-blue-700"
          >
            <Edit2 size={18} />
          </button>
          {row.status === "active" ? (
            <button
              onClick={() => deactivate(row._id)}
              className="text-red-500 hover:text-red-700"
            >
              <CheckCircle size={18} />
            </button>
          ) : (
            <button
              onClick={() => activate(row._id)}
              className="text-green-500 hover:text-green-700"
            >
              <Power size={18} />
            </button>
          )}
        </div>
      ),
    },
  ];

  if (loading) return <TableSkeleton />;
  if (error) return <p className="text-red-500">Failed to load users.</p>;

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-100 dark:border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          User Management Page
        </h1>
        <Link
          href="/dashboard/admin/users/create"
          className="flex flex-row items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          <PlusCircle size={18} /> Add User
        </Link>
      </div>
      <DataTable columns={columns} data={users} />
    </div>
  );
}
