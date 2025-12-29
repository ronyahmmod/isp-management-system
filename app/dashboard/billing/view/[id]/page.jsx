import { connectDB } from "@/lib/db";
import Billing from "@/models/Billing";
import Customer from "@/models/Customer";
import Package from "@/models/Package";
import User from "@/models/User";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Download, Printer } from "lucide-react";
import { requireEmployee } from "@/lib/requireEmployee";
import PrintButton from "@/app/components/PrintButton";

// Set this page to be a server component
export const dynamic = "force-dynamic";

export default async function PayslipHtmlView({ params }) {
  const { id } = await params;
  requireEmployee();
  await connectDB();

  const billing = await Billing.findById(id).populate(
    "customer package collectedBy"
  );
  if (!billing) {
    notFound();
  }

  const isPaid = billing.status?.toLowerCase() === "paid";
  const formattedDate = new Date(billing.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
  const billingPeriod = `${billing.month} ${billing.year}`;

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen print:p-0 print:bg-white">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-10 print:shadow-none print:rounded-none print:max-w-full print:p-0">
        <div className="flex justify-end gap-4 mb-6 print:hidden">
          <PrintButton />
        </div>

        {/* Invoice Header */}
        <header className="flex justify-between items-start mb-10">
          <div>
            {/* Replace with your Logo Component or Image Tag */}

            <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-400">
              PAYSLIP
            </h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Invoice ID:{" "}
              <span className="font-semibold">{billing.invoiceId}</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Date Issued: {formattedDate}
            </p>
            <p
              className={`mt-2 text-xl font-bold uppercase ${
                isPaid ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPaid ? "PAID" : "UNPAID"}
            </p>
          </div>
        </header>

        {/* Customer Details & Billing Period */}
        <div className="flex justify-between mb-10 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">
              Billed To:
            </p>
            <p className="mt-1 font-medium">{billing.customer?.name}</p>
            <p className="text-sm text-gray-500">{billing.customer?.address}</p>
            <p className="text-sm text-gray-500">
              Phone: {billing.customer?.phone}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase text-gray-500">
              Billing Period:
            </p>
            <p className="mt-1 font-medium">{billingPeriod}</p>
            <p className="text-sm text-gray-500">
              Payment Method: {billing.paymentMethod || "Cash"}
            </p>
          </div>
        </div>

        {/* Billing Items Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-blue-700 dark:bg-blue-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                  Amount (৳)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  {billing.package?.name} Internet Package Service
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-semibold">
                  ৳{billing.amount}
                </td>
              </tr>
              {/* Add more items if necessary in the future */}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 dark:bg-gray-900">
                <td className="px-6 py-4 text-right font-bold text-gray-800 dark:text-white">
                  GRAND TOTAL
                </td>
                <td className="px-6 py-4 text-right font-extrabold text-blue-700 dark:text-blue-400 text-lg">
                  ৳{billing.amount}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Signature Section */}
        <div className="flex justify-between mt-20 pt-10 border-t border-gray-200 dark:border-gray-700">
          <div className="w-1/3 text-center">
            <p className="mt-4 border-t pt-2 text-sm text-gray-600 dark:text-gray-400">
              Customer Signature
            </p>
          </div>
          <div className="w-1/3 text-center">
            <p className="mt-4 border-t pt-2 text-sm text-gray-600 dark:text-gray-400">
              {billing.collectedBy?.name || "Authorized Signatory"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Receivers Signature
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center mt-12 text-xs text-gray-400">
          This is a system-generated document and requires no physical signature
          to be valid.
        </p>
      </div>
    </div>
  );
}
