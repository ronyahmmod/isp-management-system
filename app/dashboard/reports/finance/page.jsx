import { getFinancialSummary } from "@/lib/finance";
import PrintButton from "@/app/components/PrintButton";
import { Calendar } from "lucide-react";

export default async function FinanceReport({ searchParams }) {
  // In Next.js 15, searchParams is a Promise
  const params = await searchParams;
  const from = params.from;
  const to = params.to;

  const start = from ? new Date(from) : new Date(new Date().setDate(1));
  const end = to ? new Date(to) : new Date();

  const summary = await getFinancialSummary(start, end);

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen print:bg-white print:p-0">
      {/* URL Filter - Hidden on Print */}
      <div className="max-w-4xl mx-auto mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border dark:border-gray-700 print:hidden">
        <form className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs font-bold text-gray-500 uppercase">
              From
            </label>
            <input
              name="from"
              type="date"
              defaultValue={from}
              className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 text-sm"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="text-xs font-bold text-gray-500 uppercase">
              To
            </label>
            <input
              name="to"
              type="date"
              defaultValue={to}
              className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 text-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Generate
          </button>
        </form>
      </div>

      {/* Main Report Card */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl p-10 print:shadow-none print:border-none">
        {/* Header */}
        <div className="flex justify-between border-b pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-black text-blue-900 dark:text-blue-400 uppercase tracking-tight">
              Financial Statement
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Calendar size={14} />
              <span>
                {start.toLocaleDateString()} — {end.toLocaleDateString()}
              </span>
            </div>
          </div>
          <PrintButton />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-4 bg-green-50 dark:bg-green-900/10 border-t-4 border-green-500 rounded-lg">
            <p className="text-xs text-green-600 font-bold uppercase">
              Total Income
            </p>
            <p className="text-2xl font-black text-green-700">
              ৳{summary.income}
            </p>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/10 border-t-4 border-red-500 rounded-lg">
            <p className="text-xs text-red-600 font-bold uppercase">
              Total Expense
            </p>
            <p className="text-2xl font-black text-red-700">
              ৳{summary.totalExpense}
            </p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border-t-4 border-blue-500 rounded-lg">
            <p className="text-xs text-blue-600 font-bold uppercase">
              Net Fund
            </p>
            <p
              className={`text-2xl font-black ${
                summary.netFund >= 0 ? "text-blue-700" : "text-red-700"
              }`}
            >
              ৳{summary.netFund}
            </p>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-4">
          <h2 className="font-bold border-b pb-2 text-gray-700 dark:text-gray-200">
            Analysis Breakdown
          </h2>
          <div className="flex justify-between py-3 border-b border-dashed border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">
              Customer Bill Collections
            </span>
            <span className="text-green-600 font-bold">
              + ৳{summary.income}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-dashed border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">
              Employee Salaries Paid
            </span>
            <span className="text-red-600 font-bold">
              - ৳{summary.salaryExpense}
            </span>
          </div>
          <div className="flex justify-between py-3 border-b border-dashed border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">
              General Office & Other Expenses
            </span>
            <span className="text-red-600 font-bold">
              - ৳{summary.officeExpense}
            </span>
          </div>

          <div className="flex justify-between py-4 bg-gray-50 dark:bg-gray-900/50 px-4 rounded-lg mt-6">
            <span className="font-black text-gray-800 dark:text-white uppercase">
              Net Profit / Loss
            </span>
            <span
              className={`font-black text-xl ${
                summary.netFund >= 0 ? "text-blue-600" : "text-red-600"
              }`}
            >
              ৳{summary.netFund}
            </span>
          </div>
        </div>

        {/* Signature Area for Printing */}
        <div className="mt-24 hidden print:flex justify-between">
          <div className="w-48 border-t border-gray-400 text-center pt-2 text-xs uppercase">
            Prepared By
          </div>
          <div className="w-48 border-t border-gray-400 text-center pt-2 text-xs uppercase">
            Authorized Signature
          </div>
        </div>

        <p className="mt-20 text-center text-[10px] text-gray-400 italic">
          Report Generated by{" "}
          {process.env.NEXT_PUBLIC_APP_NAME || "ISP Management System"} on{" "}
          {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
}
