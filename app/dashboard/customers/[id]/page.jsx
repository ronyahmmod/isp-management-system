// app/dashboard/customers/[id]/page.jsx
import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";
import Billing from "@/models/Billing";
import Package from "@/models/Package";
import User from "@/models/User";
import { notFound } from "next/navigation";

import { requireEmployee } from "@/lib/requireEmployee";
import HistoryTable from "@/app/components/HistoryTable";

export default async function CustomerPage({ params }) {
  const { id } = await params; // Next.js 15 requires awaiting params
  await requireEmployee;
  await connectDB();

  const customerData = await Customer.findById(id).populate("package").lean();
  const billingData = await Billing.find({ customer: id })
    .populate("package collectedBy")
    .sort({ createdAt: -1 })
    .lean();

  if (!customerData) notFound();

  // CLEAN DATA: The simplest way to convert Mongoose docs to plain objects
  const customer = JSON.parse(JSON.stringify(customerData));
  const billings = JSON.parse(JSON.stringify(billingData));

  // Calculate which months are unpaid
  const unpaidBills = billings.filter((b) => b.status === "unpaid");
  const monthsDueCount = unpaidBills.length;
  const unpaidMonthsList = unpaidBills.map((b) => b.month).join(", ");

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* HEADER CARD: Join Date and Address */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {customer.name}
            </h1>
            <p className="text-gray-500 mt-1">{customer.address}</p>
            <div className="flex gap-4 mt-3 text-sm">
              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                Joined: {new Date(customer.joinedAt).toLocaleDateString()}
              </span>
              <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded">
                Package: {customer.package?.name}
              </span>
            </div>
          </div>
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <p className="text-xs text-red-600 font-bold uppercase">
              Overdue Information
            </p>
            <p className="text-lg font-bold text-red-700">
              {monthsDueCount > 0
                ? `Owes for ${monthsDueCount} month(s): ${unpaidMonthsList} Total: ${customer.dueAmount}`
                : "No outstanding months"}
            </p>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
        <h2 className="text-lg font-bold mb-4">Payment History</h2>
        {/* Pass ONLY plain data array */}
        <HistoryTable billings={billings} />
      </div>
    </div>
  );
}
