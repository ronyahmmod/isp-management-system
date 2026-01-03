"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import usePackages from "@/app/hooks/usePackages";
import { fetcher } from "@/lib/fetcher";
import { customerCreateSchema } from "@/lib/validation/customerSchema";
import FormInput from "@/app/components/ui/FormInput";
import { Loader2, Save } from "lucide-react";

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
    <div>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Edit Customer: {customer?.name}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Customer Name"
            name="name"
            register={register}
            error={errors.name}
          />
          <FormInput
            label="Phone Number"
            name="phone"
            register={register}
            error={errors.phone}
          />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <FormInput
            label="Address"
            name="address"
            register={register}
            error={errors.address}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Select Package"
            name="package"
            register={register}
            error={errors.package}
            type="select"
            options={packages?.map((pkg) => ({
              value: pkg._id, // This is what the form submits (the ID)
              label: `${pkg.name} - ${pkg.price}`, // This is what the user sees
            }))}
          />
          <FormInput
            label="Connection Type"
            name="connectionType"
            register={register}
            error={errors.customerType}
            type="select"
            options={["PPPoE", "Hotspot", "Static"]}
          />
        </div>
        {isPPPoE && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="User Name"
              name="username"
              register={register}
              error={errors.username}
            />
            <FormInput
              label="Password"
              name="password"
              register={register}
              error={errors.password}
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold py-4 px-4 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-4 rounded-lg disabled:bg-slate-500"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <span className="flex flex-row items-center justify-center gap-2">
                <Save size={18} />
                Update Customer
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
