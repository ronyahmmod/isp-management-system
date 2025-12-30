import { connectDB } from "@/lib/db";
import { requireEmployee } from "@/lib/requireEmployee";
import Billing from "@/models/Billing";
import { notFound } from "next/navigation";
import PaymentForm from "@/app/components/PaymentForm";

export default async function PaymentPage({ params }) {
  const { id } = await params;
  await requireEmployee();
  await connectDB();

  const billing = await Billing.findById(id).populate("customer package");
  if (!billing) return notFound();
  if (billing.status === "paid") {
    return (
      <div className="p-10 text-center text-green-600 font-bold">
        This bill has already been paid.
      </div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Collect Cash Payment
      </h1>
      {/* Summary Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 border-l-4 border-blue-600">
        <div className="grid grid-cols-2 gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Customer</p>
          <p className="font-medium">{billing.customer?.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Package</p>
          <p className="font-medium">{billing.package?.name}</p>
          <p className="text-gray-500">Billing Period:</p>
          <p className="font-bold">
            {billing.month} {billing.year}
          </p>
          <p className="text-gray-500 text-lg">Amount to Collect:</p>
          <p className="text-xl font-extrabold text-blue-600">
            ৳{billing.amount}
          </p>
        </div>
      </div>
      <PaymentForm billingId={billing._id.toString()} amount={billing.amount} />
    </div>
  );
}
