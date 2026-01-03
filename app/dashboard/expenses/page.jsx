"use client";

import { useState, useMemo, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useExpenses from "@/app/hooks/useExpenses";
import {
  Trash2,
  Edit2,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

export default function ExpensePage() {
  const { expenses, isLoading, error } = useExpenses();
  const router = useRouter();

  // States for Pagination and Filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterItem, setFilterItem] = useState("");

  // Search Logic
  const filteredExpenses = useMemo(() => {
    if (!expenses) return [];
    return expenses.filter(
      (expense) =>
        expense.category?.toLowerCase().includes(filterItem.toLowerCase()) ||
        expense.title?.toLowerCase().includes(filterItem.toLowerCase()) ||
        expense.date?.toLowerCase().includes(filterItem.toLowerCase())
    );
  }, [expenses, filterItem]);

  // Pagination Calculations
  const totalExpenses = filteredExpenses.length;
  const totalPages = Math.ceil(totalExpenses / itemsPerPage);

  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredExpenses.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredExpenses, currentPage, itemsPerPage]);

  // Dynamic Page Numbers Logic (Shows max 10 numbers at a time)
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 10;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const handleEdit = (expense) => {
    alert(expense.name);
  };
  const handleDelete = (id) => {
    alert(id);
  };

  if (isLoading)
    return <p className="p-6 text-center animate-pulse">Loading expenses...</p>;
  if (error)
    return (
      <p className="p-6 text-red-500 text-center">Error: {error.message}</p>
    );

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-100 dark:border-gray-800">
      {/* Header Section */}
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Expenses
        </h1>
        <Link
          href="/dashboard/expenses/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Expense
        </Link>
      </div>

      {/* Filter & Settings Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search name, date or category..."
          value={filterItem}
          onChange={(e) => {
            setFilterItem(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/2 p-2.5 border rounded-lg text-gray-900 bg-gray-50 border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white dark:bg-gray-800 border rounded px-2 py-1 outline-none"
            >
              {[5, 10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm font-medium text-gray-500">
            Found: {totalExpenses}
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedExpenses.map((expense) => (
              <tr
                key={expense._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-4 py-3">{expense.date}</td>
                <td className="px-4 py-3">{expense.title}</td>
                <td className="px-4 py-3">{expense.category}</td>
                <td className="px-4 py-3">{expense.amount}</td>
                <td className="px-4 py-3">{expense.description}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(expense._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ENHANCE PAGINATION FOOTER */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 border-t pt-4 dark:border-gray-800">
        <p className="text-sm text-gray-500">
          Showing{" "}
          {Math.min(totalExpenses, (currentPage - 1) * itemsPerPage + 1)} to{" "}
          {Math.min(totalExpenses, currentPage * itemsPerPage)} of{" "}
          {totalExpenses} entries
        </p>

        <nav className="flex items-center -space-x-px gap-1">
          {/* First Page Button */}
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronsLeft size={18} />
          </button>

          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Page Numbers */}
          <div className="hidden sm:flex gap-1 mx-2">
            {getPageNumbers().map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  currentPage === num
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Next Page Button */}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>

          {/* Last Page */}
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronsRight size={18} />
          </button>
        </nav>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
          Page {currentPage} / {totalPages || 1}
        </p>
      </div>
    </div>
  );
}
