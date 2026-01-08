"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import usePackages from "@/app/hooks/usePackages";
import { CheckCircle, Edit, PlusCircle, Power, Trash2 } from "lucide-react";
import DataTable from "@/app/components/DataTable";

export default function PackageListPage() {
  const { packages, error, loading, mutate } = usePackages();

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

  const columns = [
    {
      header: "Package Name",
      accessor: "name",
    },
    {
      header: "Speed",
      accessor: "speed",
      cell: (row) => `${row.speed} Mbps`,
    },
    {
      header: "Price",
      accessor: "price",
      cell: (row) => `$${row.price}`,
    },
    {
      header: "Billing Cycle",
      accessor: "billingCycle",
      cell: (row) =>
        row.billingCycle.charAt(0).toUpperCase() + row.billingCycle.slice(1),
    },
    {
      header: "Validity",
      accessor: "validityDays",
      cell: (row) => `${row.validityDays} days`,
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              row.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.status?.toUpperCase()}
          </span>
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/packages/edit/${row._id}`}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit size={18} className="text-blue-600" />
          </Link>
          <button
            onClick={() =>
              toggleStatus(
                row._id,
                row.status === "active" ? "inactive" : "active"
              )
            }
          >
            {row.status === "active" ? (
              <CheckCircle size={18} className="text-green-600" />
            ) : (
              <Power size={18} className="text-red-500" />
            )}
          </button>
          <button title="Delete" onClick={() => handleDelete(row._id)}>
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
          Packages List
        </h1>
        <Link
          href="/dashboard/packages/create"
          className="flex flex-row  items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          <PlusCircle size={18} />
          Add Package
        </Link>
      </div>
      <DataTable
        data={packages}
        columns={columns}
        searchPlaceholder="Search by Package Name, ..."
      />
    </div>
  );
}
