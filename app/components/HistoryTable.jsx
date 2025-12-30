"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, UserCheck, Calendar } from "lucide-react";

export default function HistoryTable({ billings }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(billings.length / itemsPerPage);
  const currentData = billings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border rounded-lg dark:border-gray-700">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-900 font-bold uppercase text-gray-600 dark:text-gray-300">
            <tr>
              <th className="p-4">Billing Period</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Payment Info</th>
              <th className="p-4">Collector</th>
              <th className="p-4 text-center">View</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {currentData.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="p-4">{item.month}</td>
                <td className="p-4 font-bold text-gray-900 dark:text-white">
                  {item.amount}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      item.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status.toUpperCase()}
                  </span>
                </td>

                {/* Payment Info */}
                <td className="p-4 text-gray-500">
                  {item.paidAt ? (
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(item.paidAt).toLocaleDateString()}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                {/* Collector (Who Collect) */}
                <td className="p-4">
                  {item.collectedBy ? (
                    <div className="flex items-center gap-1 text-blue-600 font-medium">
                      <UserCheck size={14} />
                      {item.collectedBy.name}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">Pending</span>
                  )}
                </td>
                <td className="p-4">
                  <Link
                    href={`/dashboard/billing/view/${item._id}`}
                    className="text-blue-600"
                  >
                    <Eye size={18} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Simplified Pagination */}
      <div className="flex justify-between items-center text-sm">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-30"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-3 py-1 border rounded disabled:opacity-30"
        >
          Next
        </button>
      </div>
    </div>
  );
}
