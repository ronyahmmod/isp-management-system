"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function DataTable({
  data = [],
  columns = [],
  searchPlaceholder = "Search...",
  initialItemsPerPage = 10,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
  const [filterTerm, setFilterTerm] = useState("");

  // Helper for deep nested values (e.g., "customer.name")
  const getNestedValue = (obj, path) => {
    if (!path) return ""; // FIX: Handle columns without accessors (Actions)
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  // Search Logic
  const filteredData = useMemo(() => {
    if (!filterTerm) return data;
    return data.filter((item) =>
      columns.some((col) => {
        if (!col.accessor) return false; // FIX: Skip columns like 'Actions' during search
        const val = getNestedValue(item, col.accessor);
        return String(val).toLowerCase().includes(filterTerm.toLowerCase());
      })
    );
  }, [data, filterTerm, columns]);

  // ... (Pagination Logic and getPageNumbers remain the same as your code)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 10;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="w-full">
      {/* Top Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={filterTerm}
          onChange={(e) => {
            setFilterTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/2 p-2.5 border rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
        />
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded-lg px-2 py-1.5 dark:bg-gray-800 dark:border-gray-700 outline-none"
          >
            {[5, 10, 25, 50].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <span>Entries</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto border rounded-2xl dark:border-gray-700 bg-white dark:bg-gray-900">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-800/50 uppercase font-bold text-gray-600 dark:text-gray-400 border-b dark:border-gray-700">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className={`p-4 ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-800">
            {paginatedData.map((row, i) => (
              <tr
                key={row._id || i}
                className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
              >
                {columns.map((col, j) => (
                  <td key={j} className={`p-4 ${col.className || ""}`}>
                    {col.cell
                      ? col.cell(row)
                      : getNestedValue(row, col.accessor)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
          Showing{" "}
          {Math.min(filteredData.length, (currentPage - 1) * itemsPerPage + 1)}{" "}
          to {Math.min(filteredData.length, currentPage * itemsPerPage)} of{" "}
          {filteredData.length}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-20 transition-colors"
          >
            <ChevronsLeft size={18} />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-20 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="hidden md:flex gap-1 mx-2">
            {getPageNumbers().map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                  currentPage === num
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent dark:border-gray-700"
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-20 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-20 transition-colors"
          >
            <ChevronsRight size={18} />
          </button>
        </div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
          Page {currentPage} / {totalPages || 1}
        </p>
      </div>
    </div>
  );
}
