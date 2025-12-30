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
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
  };

  // Search Logic across all columns
  const filteredData = useMemo(() => {
    if (!filterTerm) return data;
    return data.filter((item) =>
      columns.some((col) => {
        const val = getNestedValue(item, col.accessor);
        return String(val).toLowerCase().includes(filterTerm.toLowerCase());
      })
    );
  }, [data, filterTerm, columns]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Page Numbers (Logic to show max 10 buttons)
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
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={filterTerm}
          onChange={(e) => {
            setFilterTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/2 p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700"
        />
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded px-2 py-1 dark:bg-gray-800"
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

      <div className="overflow-x-auto border rounded-lg dark:border-gray-700">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-700 uppercase font-bold text-gray-600 dark:text-gray-200">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="p-4">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {paginatedData.map((row, i) => (
              <tr
                key={row._id || i}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {columns.map((col, j) => (
                  <td key={j} className="p-4">
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

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-xs text-gray-500 uppercase tracking-widest">
          Page {currentPage} of {totalPages || 1}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="p-2 disabled:opacity-20"
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 disabled:opacity-20"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="hidden sm:flex gap-1">
            {getPageNumbers().map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-1 rounded ${
                  currentPage === num
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 disabled:opacity-20"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 disabled:opacity-20"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
