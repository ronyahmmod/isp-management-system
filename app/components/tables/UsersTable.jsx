// components/tables/UsersTable.client.jsx
"use client";
import { useState, useMemo } from "react";
import Link from "next/link"; // Import Link for navigation

// Define items per page constant
const ITEMS_PER_PAGE = 10;

export default function UsersTable({ users = [], onDeleted = () => {} }) {
  const [loadingId, setLoadingId] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // --- Filtering Logic ---
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const lowerCaseFilter = filterText.toLowerCase();
      return (
        user.name.toLowerCase().includes(lowerCaseFilter) ||
        user.email.toLowerCase().includes(lowerCaseFilter) ||
        user.role.toLowerCase().includes(lowerCaseFilter) ||
        (user.status || "active").toLowerCase().includes(lowerCaseFilter)
      );
    });
  }, [users, filterText]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // --- Deletion Handler ---
  async function handleDelete(id) {
    if (!confirm("Delete this user?")) return;
    setLoadingId(id);
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    setLoadingId(null);
    onDeleted();
    // After deletion, re-evaluate current page context if needed (omitted for brevity, onDeleted handles refetch usually)
  }

  return (
    <div>
      {/* Header Section: Total Users, Filter Input, Add User Button */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Total Users: {users.length}</h2>
          <input
            type="text"
            placeholder="Filter users..."
            className="p-2 border rounded shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={filterText}
            onChange={(e) => {
              setFilterText(e.target.value);
              setCurrentPage(1); // Reset to first page when filtering
            }}
          />
        </div>
        <Link
          href="/dashboard/admin/users/create"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add New User
        </Link>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-600 dark:text-gray-400">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u) => (
              <tr
                key={u._id}
                className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">{u.status || "active"}</td>
                <td className="p-2 flex gap-2">
                  <button className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="px-2 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                    disabled={loadingId === u._id}
                  >
                    {loadingId === u._id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 p-2 bg-white dark:bg-gray-800 rounded shadow-md">
          <p className="text-sm dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 dark:disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 dark:disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
