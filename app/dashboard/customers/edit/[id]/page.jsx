"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR from "swr";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import usePackages from "@/app/hooks/usePackages";
import { fetcher } from "@/lib/fetcher";
import { customerCreateSchema } from "@/lib/validation/customerSchema";

export default function EditCustomerPage() {
  const { id } = useParams();
  const router = useRouter();
  const { packages } = usePackages();
  const { data: customer, isLoading } = useSWR(
    id ? `/api/customers/${id}` : null,
    fetcher
  );
  const {
    register,
    handleSubmit,
    watch,
    reset,

    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm({
    resolver: zodResolver(customerCreateSchema),
    values: customer
      ? {
          ...customer,
          package: customer.package?._id || customer.package,
        }
      : undefined,
  });

  const onError = (errors) => {
    console.log("Form errors", errors);
  };

  const onSubmit = async (values) => {
    try {
      const res = await fetch(`/api/customers/update`, {
        method: "PUT", // Use PUT or PATCH for updates
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: customer._id, ...values }),
      });

      if (res.ok) {
        alert("Customer updated successfully!");
        router.push("/dashboard/customers"); // Redirect back to list
      }
    } catch (err) {
      console.error("Update error", err);
    }
  };

  const isPPPoE = watch("connectionType") === "PPPoE";
  // Submit handler is define letter
  if (isLoading || !customer)
    return <div className="p-8 dark:text-white">Loading customer data.</div>;

  return (
    <div className="p-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="max-w-xl mx-auto space-y-4 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800"
      >
        <h2 className="text-xl font-bold dark:text-white">
          Edit Customer: {customer?.name}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm dark:text-slate-400 ml-1">Name</label>
            <input
              {...register("name")}
              className="p-2 border rounded dark:bg-slate-800 dark:text-white dark:border-slate-700"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm dark:text-slate-400 ml-1">Phone</label>
            <input
              {...register("phone")}
              className="p-2 border rounded dark:bg-slate-800 dark:text-white dark:border-slate-700"
            />
          </div>
        </div>
        <div>
          <label className="text-sm dark:text-slate-400 ml-1">Address</label>
          <input
            {...register("address")}
            className="w-full p-2 border rounded dark:bg-slate-800 dark:text-white dark:border-slate-700"
          />
        </div>

        <div>
          <label className="text-sm dark:text-slate-400 ml-1">
            Internet Package
          </label>
          <select
            {...register("package")}
            className="w-full p-2 border rounded dark:bg-slate-800 dark:text-white dark:border-slate-700"
          >
            <option value="">Select Package</option>
            {packages?.map((pkg) => (
              <option key={pkg._id} value={pkg._id}>
                {pkg.name} - {pkg.price}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm dark:text-slate-400 ml-1">
            Connection Type
          </label>
          <select
            {...register("connectionType")}
            className="w-full p-2 border rounded dark:bg-slate-800 dark:text-white dark:border-slate-700"
          >
            <option value="PPPoE">PPPoE</option>
            <option value="Hotspot">Hotspot</option>
            <option value="Static">Static</option>
          </select>
        </div>

        {isPPPoE && (
          <div className="grid grid-cols-2 gap-4 p-3 bg-slate-100 dark:bg-slate-800 rounded">
            <input
              {...register("username")}
              placeholder="PPPoE User"
              className="p-2 border rounded dark:bg-slate-700 dark:text-white"
            />
            <input
              {...register("password")}
              type="text"
              placeholder="PPPoE Pass"
              className="p-2 border rounded dark:bg-slate-700 dark:text-white"
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold py-2 px-4 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-slate-500"
          >
            {isSubmitting ? "Updating..." : "Update Customer"}
          </button>
        </div>
      </form>
    </div>
  );
}
