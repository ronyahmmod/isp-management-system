"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerCreateSchema } from "@/lib/validation/customerSchema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import usePackages from "@/app/hooks/usePackages";

const Input = ({ label, id, error, ...props }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {label}
    </label>
    <input
      id={id}
      {...props}
      className="mt-1 p-2 block w-full rounded-md border dark:shadow-sm focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-700 dark:text-white"
    />
    {error && (
      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
        {error.message}
      </p>
    )}
  </div>
);

export default function CreateCustomerForm() {
  const [submitStatus, setSubmitStatus] = useState(null);
  const { packages, loading, error, mutate } = usePackages();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(customerCreateSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      package: "",
      connectionType: "PPPoE",
      username: "",
      password: "",
    },
  });

  const currentConnectionType = watch("connectionType");
  const isPPPoE = currentConnectionType === "PPPoE";

  async function onSubmit(data) {
    // 1. Generate nextBillingDate (e.g., 1 month from now)
    const billingDate = new Date();
    billingDate.setMonth(billingDate.getMonth() + 1);

    // 2. Prepare the final payload for Mongoose
    const finalData = {
      ...data,
      nextBillingDate: billingDate, // Provide the generated date
    };
    try {
      const response = await fetch("/api/customers/create", {
        method: "POST",
        body: JSON.stringify(finalData),
      });
      if (response.ok) {
        alert("Customer created successfully");
        setSubmitStatus("Success");
      }
    } catch (error) {
      setSubmitStatus(`Error`);
      console.log(error);
    }

    router.push("/dashboard/customers");
  }
  if (loading)
    return <div className="dark:text-white">Loading packages...</div>;
  if (error)
    return <div className="dark:text-red-500">Failed to load packages.</div>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
        New Customer Registration
      </h2>
      <Input
        label="Customer Name"
        id="name"
        {...register("name")}
        error={errors.name}
        required
      />
      <Input
        label="Customer Mobile Number"
        id="Phone"
        {...register("phone")}
        error={errors.phone}
        required
      />
      <Input
        label="Email (Optional)"
        id="email"
        {...register("email")}
        error={errors.email}
      />

      <Input
        label="Address"
        id="address"
        {...register("address")}
        error={errors.address}
        required
      />

      <div>
        <label
          htmlFor="package"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Choose Package
        </label>
        <select
          id="package"
          {...register("package")}
          className="mt-1 p-2 block w-full rounded-md border dark:shadow-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white-600"
        >
          <option value="">Select Package</option>
          {packages.map((pkg) => (
            <option key={pkg._id} value={pkg._id}>
              {pkg.name} - ${pkg.price}
            </option>
          ))}
        </select>
        {errors.package && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.package.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="connectionType"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Connection Type
        </label>
        <select
          id="connectionType"
          {...register("connectionType")}
          className="mt-1 p-2 block w-full rounded-md border dark:shadow-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {["Static", "PPPoE", "Hotspot", "Cable"].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.connectionType && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.connectionType.message}
          </p>
        )}
      </div>
      {/* Conditional Fields for PPPoE */}
      {isPPPoE && (
        <div className="space-y-4 p-4 border border-blue-200 dark:border-blue-700 rounded-md bg-blue-50 dark:bg-blue-900/50">
          <p className="text-gray-700 dark:text-gray-200 font-medium">
            PPPoE Details:
          </p>
          <Input
            label="Username"
            id="username"
            {...register("username")}
            error={errors.username}
          />
          <Input
            label="Password"
            id="password"
            type="password"
            {...register("password")}
            error={errors.password}
          />
        </div>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 disabled:bg-gray-400 dark:bg-blue-700 dark:hover:bg-blue-600"
      >
        {isSubmitting ? "Saving..." : "Create Customer"}
      </button>

      {submitStatus === "success" && (
        <p className="text-green-600 dark:text-green-400">
          Customer created successfully!
        </p>
      )}
      {submitStatus === "error" && (
        <p className="text-red-600 dark:text-red-400">
          An error occurred during submission.
        </p>
      )}
    </form>
  );
}
