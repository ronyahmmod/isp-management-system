// app/dashboard/customers/page.jsx
"use client";

import Link from "next/link";
import useCustomers from "@/app/hooks/useCustomers";
import DataTable from "@/app/components/DataTable";
import {
  CheckCircle,
  Edit,
  Eye,
  PlusCircle,
  Power,
  Trash2,
} from "lucide-react";

export default function CustomerListPage() {
  const { customers, error, isLoading, mutate } = useCustomers();

  // --------------------------------------------------

  if (isLoading)
    return <p className="text-gray-800 dark:text-gray-200">Loading...</p>;
  if (error)
    return (
      <p className="text-red-500">Failed to load customers. {error.message}</p>
    );

  async function toggleStatus(id, status) {
    await fetch("/api/customers/status", {
      method: "PUT",
      body: JSON.stringify({ id, status }),
      headers: { "Content-Type": "application/json" },
    });
    mutate();
  }

  async function deleteCustomer(id) {
    if (confirm("Are you sure you want to delete this customer?")) {
      await fetch("/api/customers/delete", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });
      mutate();
    }
  }

  const columns = [
    { header: "Customer Name", accessor: "name" },
    { header: "Phone Number", accessor: "phone" },
    {
      header: "Package-Price",
      accessor: "package.name",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 dark:text-white">
            {row.package?.name}
          </span>
          <span className="text-xs text-blue-600 font-medium">
            Rate: {row.package?.price}
          </span>
        </div>
      ),
    },
    { header: "Billing Cycle", accessor: "nextBillingDate" },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <div className="font-bold uppercase">
          {row.status === "active" ? (
            <span className="text-green-600">Active</span>
          ) : (
            <span className="text-red-600">Inactive</span>
          )}
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row) => (
        <div className="flex gap-2">
          <Link
            href={`/dashboard/customers/${row._id}`}
            className="text-blue-600 hover:underline"
          >
            <Eye size={18} className="text-gray-500" />
          </Link>
          <Link
            href={`/dashboard/customers/edit/${row._id}`}
            className="text-blue-600 hover:underline"
          >
            <Edit size={18} className="text-blue-600" />
          </Link>
          {/* Toggle Active/InActive Example */}
          <button
            onClick={() => toggleStatus(row._id)}
            title={row.status === "active" ? "Deactivate" : "Activate"}
            className="cursor:pointer"
          >
            {row.status === "active" ? (
              <CheckCircle size={18} className="text-green-600" />
            ) : (
              <Power size={18} className="text-red-500" />
            )}
          </button>
          <button title="Delete" onClick={() => deleteCustomer(row._id)}>
            <Trash2 size={18} className="text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Customer List
        </h1>
        <Link
          href="/dashboard/customers/create"
          className="flex flex-row  items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          <PlusCircle size={18} />
          Add Customer
        </Link>
      </div>

      {/* Filter Input and Total Count */}
      <DataTable
        data={customers}
        columns={columns}
        searchPlaceholder="Search by Name, Phone Number, ..."
      />
    </div>
  );
}
