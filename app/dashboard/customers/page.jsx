// app/dashboard/customers/page.jsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import useCustomers from "@/app/hooks/useCustomers";

export default function CustomerListPage() {
  const { customers, error, isLoading, mutate } = useCustomers();

  // --- Client-side pagination and filtering state ---
  const [currentPage, setCurrentPage] = useState(1);
  const [filterTerm, setFilterTerm] = useState("");
  const CUSTOMERS_PER_PAGE = 5; // Define how many customers to show per page

  // Calculate filtered and paginated customers using useMemo
  const filteredCustomers = useMemo(() => {
    if (!customers) return [];

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(filterTerm.toLowerCase()) ||
        customer.phone.toLowerCase().includes(filterTerm.toLowerCase()) ||
        customer.package.toLowerCase().includes(filterTerm.toLowerCase())
    );
  }, [customers, filterTerm]);

  const totalCustomers = filteredCustomers.length;
  const totalPages = Math.ceil(totalCustomers / CUSTOMERS_PER_PAGE);

  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * CUSTOMERS_PER_PAGE;
    return filteredCustomers.slice(startIndex, startIndex + CUSTOMERS_PER_PAGE);
  }, [filteredCustomers, currentPage]);

  // Reset page to 1 when filter changes
  const handleFilterChange = (e) => {
    setFilterTerm(e.target.value);
    setCurrentPage(1);
  };
  // --------------------------------------------------

  if (isLoading)
    return <p className="text-gray-800 dark:text-gray-200">Loading...</p>;
  if (error) return <p className="text-red-500">Failed to load customers.</p>;

  async function toggleStatus(id, status) {
    await fetch("/api/customers/status", {
      method: "PUT",
      body: JSON.stringify({ id, status }),
      headers: { "Content-Type": "application/json" },
    });
    mutate();
  }

  return (
    <div>
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Customer List
        </h1>
        <Link
          href="/dashboard/customers/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Customer
        </Link>
      </div>

      {/* Filter Input and Total Count */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Filter by name, phone, or package..."
          value={filterTerm}
          onChange={handleFilterChange}
          // Dark mode styles added here
          className="w-1/2 p-2 border rounded text-gray-900 bg-white border-gray-300
                     dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />
        <p className="text-gray-600 dark:text-gray-400">
          Total Customers Found: {totalCustomers}
        </p>
      </div>

      <table className="w-full border dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
            <th className="p-3 text-left">Name</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Package</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {/* Render only the paginated customers */}
          {paginatedCustomers.map((c) => (
            // Dark mode styles added to table rows
            <tr
              key={c._id}
              className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-800 dark:text-gray-200"
            >
              <td className="p-3">{c.name}</td>
              <td className="p-3">{c.phone}</td>
              <td className="p-3">{c.package}</td>
              <td className="p-3">
                {/* Visual status indicators */}
                {c.status === "active" ? (
                  <span className="text-green-600 dark:text-green-400">
                    🟢 Active
                  </span>
                ) : (
                  <span className="text-red-500 dark:text-red-400">
                    🔴 Inactive
                  </span>
                )}
              </td>
              <td className="p-3 flex gap-2">
                <Link
                  href={`/dashboard/customers/edit/${c._id}`}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </Link>

                {c.status === "active" ? (
                  <button
                    onClick={() => toggleStatus(c._id, "inactive")}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() => toggleStatus(c._id, "active")}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
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
        <div className="flex justify-center mt-6 gap-3 text-gray-800 dark:text-gray-200">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            // Dark mode styles added to pagination buttons
            className="px-4 py-2 border rounded disabled:opacity-50 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            Previous
          </button>

          <span className="p-2">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            // Dark mode styles added to pagination buttons
            className="px-4 py-2 border rounded disabled:opacity-50 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
