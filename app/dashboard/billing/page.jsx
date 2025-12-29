"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useBillings from "@/app/hooks/useBillings";
import {
  Eye,
  Download,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function BillingPage() {
  const { billings, error, isLoading, mutate } = useBillings();
  const router = useRouter();

  // States for Pagination and Filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Custom items per page
  const [filterTerm, setFilterTerm] = useState("");

  // Search Logic
  const filteredBillings = useMemo(() => {
    if (!billings) return [];
    return billings.filter(
      (billing) =>
        billing.customer?.name
          .toLowerCase()
          .includes(filterTerm.toLowerCase()) ||
        billing.customer?.phone.includes(filterTerm) ||
        billing.package?.name.toLowerCase().includes(filterTerm.toLowerCase())
    );
  }, [billings, filterTerm]);

  // Pagination Calculations
  const totalBillings = filteredBillings.length;
  const totalPages = Math.ceil(totalBillings / itemsPerPage);

  const paginatedBillings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBillings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBillings, currentPage, itemsPerPage]);

  // Dynamic Page Numbers Logic (Shows max 10 numbers at a time)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 10;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
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

  if (isLoading)
    return <p className="p-6 text-center animate-pulse">Loading billings...</p>;
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

      {/* Filter and Settings Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search name, phone, or package..."
          value={filterTerm}
          onChange={(e) => {
            setFilterTerm(e.target.value);
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
              {[5, 10, 25, 50, 100].map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm font-medium text-gray-500">
            Found: {totalBillings}
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">
            <tr>
              <th className="p-4 font-semibold">Invoice ID</th>
              <th className="p-4 font-semibold">Customer Name</th>
              <th className="p-4 font-semibold">Phone</th>
              <th className="p-4 font-semibold">Package</th>
              <th className="p-4 font-semibold text-right">Amount</th>
              <th className="p-4 font-semibold">Billing Date</th>
              <th className="p-4 font-semibold text-center">Status</th>
              <th className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedBillings.map((billing) => (
              <tr
                key={billing._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="p-4 font-mono text-xs text-gray-500">
                  {billing.invoiceId || "N/A"}
                </td>
                <td className="p-4">
                  <Link
                    href={`/dashboard/customers/${billing.customer?._id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {billing.customer?.name}
                  </Link>
                </td>
                <td className="p-4">{billing.customer?.phone}</td>
                <td className="p-4">{billing.package?.name}</td>
                <td className="p-4 text-right font-bold">৳{billing?.amount}</td>
                <td className="p-4 whitespace-nowrap">
                  {new Date(
                    billing.customer?.nextBillingDate
                  ).toLocaleDateString()}
                </td>
                <td className="p-4 text-center">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      billing.status.toLowerCase() === "paid"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {billing.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center items-center gap-3">
                    <Link
                      href={`/dashboard/billing/view/${billing._id}`}
                      title="View HTML Bill"
                    >
                      <Eye
                        size={18}
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                      />
                    </Link>
                    <button
                      onClick={() => handleDownloadPDF(billing._id)}
                      title="Download PDF"
                    >
                      <Download
                        size={18}
                        className="text-gray-500 hover:text-green-600 transition-colors"
                      />
                    </button>
                    {billing?.status.toLowerCase() !== "paid" && (
                      <button
                        onClick={() =>
                          router.push(`/dashboard/billing/pay/${billing._id}`)
                        }
                        className="flex items-center text-blue-600 hover:text-blue-800 font-bold bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded"
                      >
                        <CreditCard size={14} className="mr-1" /> Pay
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ENHANCED PAGINATION FOOTER */}
      <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 border-t pt-4 dark:border-gray-800">
        <p className="text-sm text-gray-500">
          Showing{" "}
          {Math.min(totalBillings, (currentPage - 1) * itemsPerPage + 1)} to{" "}
          {Math.min(totalBillings, currentPage * itemsPerPage)} of{" "}
          {totalBillings} entries
        </p>

        <nav className="flex items-center -space-x-px gap-1">
          {/* First Page */}
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronsLeft size={18} />
          </button>

          {/* Previous Page */}
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

          {/* Next Page */}
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
