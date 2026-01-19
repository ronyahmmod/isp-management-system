"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import useBillings from "@/app/hooks/useBillings";
import { Eye, Download, CreditCard } from "lucide-react";
import TableSkeleton from "@/app/components/TableSkeleton";
import DataTable from "@/app/components/DataTable";

export default function BillingPage() {
  const { billings, error, isLoading, mutate } = useBillings();
  const router = useRouter();

  const columns = [
    { header: "Invoice ID", accessor: "invoiceId" },
    {
      header: "Customer",
      accessor: "customer.name",
      cell: (row) => (
        <Link
          href={`/dashboard/customers/${row.customer?._id}`}
          className="font-medium text-blue-600 hover:underline"
        >
          {row.customer?.name}
        </Link>
      ),
    },
    {
      header: "Phone",
      accessor: "customer.phone",
      cell: (row) => row.customer?.phone,
    },
    {
      header: "Package",
      accessor: "package.name",
      cell: (row) => row.package?.name,
    },
    {
      header: "Amount",
      accessor: "amount",
      cell: (row) => `৳${row.amount.toLocaleString()}`,
    },
    {
      header: "Status",
      accessor: "status",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === "paid"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row) => (
        <div className="flex gap-2">
          <Link
            href={`/dashboard/billing/view/${row._id}`}
            title="View Bill"
            className="text-blue-500 hover:text-blue-700"
          >
            <Eye size={18} />
          </Link>

          <button
            onClick={() => handleDownloadPDF(row._id)}
            title="Download Invoice"
            className="text-green-500 hover:text-green-700"
          >
            <Download size={18} />
          </button>

          {row.status === "unpaid" && (
            <button
              onClick={() => handlePayment(row._id)}
              title="Pay"
              className="text-purple-500 hover:text-purple-700"
            >
              <CreditCard size={18} />
            </button>
          )}
        </div>
      ),
    },
  ];

  const handlePayment = (id) => {
    router.push(`/dashboard/billing/pay/${id}`);
  };

  const runBilling = async () => {
    try {
      const res = await fetch("/api/cron/billing");
      const data = await res.json();
      alert(`Sync Complete: ${data.message || "Processed"}`);
      mutate();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownloadPDF = async (id) => {
    // alert("PDF Download feature coming soon for: " + id);
    try {
      const res = await fetch(`/api/billings/${id}/pdf`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Payslip_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error(error);
    }
  };

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
          Revenue & Billing
        </h1>
        <button
          onClick={runBilling}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          Sync Billing
        </button>
      </div>

      {/* Data Table */}
      <DataTable data={billings} columns={columns} />
    </div>
  );
}
