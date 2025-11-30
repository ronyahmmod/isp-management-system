// app/dashboard/admin/users/page.jsx
"use client";

import { useState, useMemo } from "react"; // Import useState and useMemo
import useUsers from "@/app/hooks/useUsers";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link for navigation

export default function UsersPage() {
  const router = useRouter();
  const { users, loading, error, mutate } = useUsers();

  // --- Client-side pagination and filtering state ---
  const [currentPage, setCurrentPage] = useState(1);
  const [filterTerm, setFilterTerm] = useState("");
  const USERS_PER_PAGE = 5; // Define how many users to show per page

  // Calculate filtered and paginated users using useMemo for performance
  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(filterTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(filterTerm.toLowerCase())
    );
  }, [users, filterTerm]); // Re-calculate when users or filterTerm changes

  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
  }, [filteredUsers, currentPage]); // Re-calculate when filteredUsers or currentPage changes

  // Reset page to 1 when filter changes
  const handleFilterChange = (e) => {
    setFilterTerm(e.target.value);
    setCurrentPage(1);
  };
  // --------------------------------------------------

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

  if (loading) return <p className="text-center p-4">Loading...</p>;
  if (error) return <p className="text-red-500">Failed to load users.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <div className="flex justify-between items-center mb-4">
        {/* Display total number of users found after filtering */}
        <p className="text-gray-600">Total Users Found: {totalUsers}</p>

        {/* Button to add a new user */}
        <Link href="/dashboard/admin/users/create">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Add New User
          </button>
        </Link>
      </div>

      {/* Filter input field */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by name or email..."
          className="p-2 border border-gray-300 rounded w-full"
          value={filterTerm}
          onChange={handleFilterChange}
        />
      </div>

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
          {/* Render only the paginated users */}
          {paginatedUsers.map((u) => (
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
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                  onClick={() => handleEdit(u._id)}
                >
                  Edit
                </button>
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="p-1">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
