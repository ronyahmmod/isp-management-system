"use client";

import Link from "next/link";

import useExpenses from "@/app/hooks/useExpenses";
import { Trash2, Edit2, PlusCircle } from "lucide-react";
import TableSkeleton from "@/app/components/TableSkeleton";
import DataTable from "@/app/components/DataTable";

export default function ExpensePage() {
  const { expenses, isLoading, error } = useExpenses();

  const handleEdit = (expense) => {
    alert(expense.name);
  };
  const handleDelete = (id) => {
    alert(id);
  };

  const columns = [
    {
      header: "Date",
      accessor: "date",
      cell: (row) => {
        const date = new Date(row.date);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Category",
      accessor: "category",
    },
    {
      header: "Amount",
      accessor: "amount",
      cell: (row) => `$${row.amount.toFixed(2)}`,
    },
    {
      header: "Description",
      accessor: "description",
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) return <TableSkeleton />;
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
          className="flex flex-row items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          <PlusCircle size={18} />
          Add Expense
        </Link>
      </div>

      {/* Expenses Table */}
      <DataTable columns={columns} data={expenses} />
    </div>
  );
}
