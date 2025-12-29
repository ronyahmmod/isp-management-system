"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import usePackages from "@/app/hooks/usePackages";

export default function PackageListPage() {
  const { packages, error, loading, mutate } = usePackages();

  // --- Client Side pagination, pagination and filtering state

  const [currentPage, setCurrentPage] = useState(1);
  const [filterTerm, setFilterTerm] = useState("");
  const PACKAGES_PER_PAGE = 5;

  // Calculate filtered and paginated packages list
  const filteredPackages = useMemo(() => {
    if (!packages) return [];
    return packages.filter(
      (p) =>
        p.name.toLowerCase().includes(filterTerm.toLowerCase()) ||
        p.status.toLowerCase().includes(filterTerm.toLowerCase())
    );
  }, [packages, filterTerm]);

  const totalPackages = packages.length;
  const totalPages = Math.ceil(totalPackages / PACKAGES_PER_PAGE);

  const paginatedPackages = useMemo(() => {
    const startIndex = (currentPage - 1) * PACKAGES_PER_PAGE;
    return filteredPackages.slice(startIndex, startIndex + PACKAGES_PER_PAGE);
  }, [filteredPackages, currentPage]);

  const handleFilterChange = (e) => {
    setFilterTerm(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return <p className="text-gray-800 dark:text-gray-200">Loading...</p>;
  }

  if (error) return <p className="text-red-800">Failed to load packages</p>;

  async function toggleStatus(id, status) {
    await fetch("/api/packages/status", {
      method: "PUT",
      body: JSON.stringify({ id, status }),
      headers: { "Content-Type": "application/json" },
    });
    mutate();
  }

  //   if (totalPackages === 0) {
  //     return (
  //       <p className="text-gray-800 dark:text-gray-200">There is no packages.</p>
  //     );
  //   }
  return (
    <div>
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Packages List
        </h1>
        <Link
          href="/dashboard/packages/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Package
        </Link>
      </div>

      {/* Filtered input and total count */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          name="filterTerm"
          value={filterTerm}
          placeholder="Filter by name and status"
          onChange={handleFilterChange}
          className="w-1/2 p-2 rounded text-gray-900 bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />
        <p className="text-gray-600 dark:text-gray-400">
          Total Packages Found: {totalPackages}
        </p>
      </div>

      <table className="w-full border dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2">Speed</th>
            <th className="p-2">Price</th>
            <th className="p-2">Billing Cycle</th>
            <th className="p-2">Validity Days</th>
            <th className="p-2">Status</th>
            <th className="p-2">Created On</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {/* Render only the paginated packages */}
          {paginatedPackages.map((p) => (
            <tr
              key={p._id}
              className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-800 dark:text-gray-200"
            >
              <td className="p-3">{p.name.toUpperCase()}</td>
              <td className="p-3">{p.speed.toUpperCase()}</td>
              <td className="p-3">{p.price}</td>
              <td className="p-3">{p.billingCycle.toUpperCase()}</td>
              <td className="p-3">{p.validityDays}</td>
              <td className="p-3">
                {/* Visual status indicators */}
                {p.status === "active" ? (
                  <span className="text-green-600 dark:text-green-400">
                    🟢 Active
                  </span>
                ) : (
                  <span className="text-red-500 dark:text-red-400">
                    🔴 Inactive
                  </span>
                )}
              </td>
              <td className="p-3">{p.createdAt}</td>
              <td className="p-3 flex gap-2">
                <Link
                  href={`/dashboard/packages/edit/${p._id}`}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </Link>

                {p.status === "active" ? (
                  <button
                    onClick={() => toggleStatus(p._id, "inactive")}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() => toggleStatus(p._id, "active")}
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
