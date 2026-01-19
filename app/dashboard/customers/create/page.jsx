"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerCreateSchema } from "@/lib/validation/customerSchema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import usePackages from "@/app/hooks/usePackages";
import FormInput from "@/app/components/ui/FormInput";
import { generateSingleBill } from "@/lib/bill/billingGenerator";
import SubmitButton from "@/app/components/ui/SubmitButton";

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
        const customerData = await response.json();
        console.log(customerData);
        const billRes = await generateSingleBill(customerData.customer._id);
        if (billRes.success) {
          console.log(billRes);
          router.push(`/dashboard/billing/pay/${billRes.bill._id}`);
        }
      }
    } catch (error) {
      setSubmitStatus(`Error`);
      console.log(error);
    }
  }
  if (loading)
    return <div className="dark:text-white">Loading packages...</div>;
  if (error)
    return <div className="dark:text-red-500">Failed to load packages.</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        New Customer Registration
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Enter Customer Name"
          name="name"
          register={register}
          error={errors.name}
          placeholder="e.g. Md. Billal Hossain"
          rules={{ required: "Customer name is required" }}
        />
        <FormInput
          label="Enter Customer Mobile Number"
          name="phone"
          register={register}
          error={errors.phone}
          placeholder="e.g. 01712345678"
          rules={{ required: "Mobile number is required" }}
        />
      </div>
      <div className="grid grid-cols-1 gap-8">
        <FormInput
          label="Enter Customer Email (Optional)"
          name="email"
          register={register}
          error={errors.email}
          placeholder="e.g. billal@gmail.com"
        />
      </div>
      <div className="grid grid-cols-1 gap-8">
        <FormInput
          label="Enter Customer Address"
          name="address"
          register={register}
          error={errors.address}
          placeholder="e.g. 123 Main St, City, Country"
          rules={{ required: "Address is required" }}
        />
      </div>

      {/* Package Selection */}
      <div className="grid grid-cols-1 gap-8">
        <FormInput
          label="Chose Package"
          name="package"
          register={register}
          error={errors.package}
          type="select"
          rules={{ required: "Package is required" }}
          options={packages.map((pkg) => ({
            value: pkg._id,
            label: `${pkg.name} - $${pkg.price}`,
          }))}
        />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <FormInput
          label="Select Connection Type"
          name="connectionType"
          register={register}
          error={errors.connectionType}
          type="select"
          rules={{ required: "Connection type is required" }}
          options={["Static", "PPPoE", "Hotspot", "Cable"]}
        />
      </div>

      {/* Conditional Fields for PPPoE */}
      {isPPPoE && (
        <div className="space-y-4 p-4 border border-blue-200 dark:border-blue-700 rounded-md bg-blue-50 dark:bg-blue-900/50">
          <p className="text-gray-700 dark:text-gray-200 font-medium">
            PPPoE Details:
          </p>
          <FormInput
            label="User Name"
            name="username"
            placeholder="e.g. billal1234"
            register={register}
            error={errors.username}
          />
          <FormInput
            label="Password"
            name="password"
            placeholder="e.g. billal1234"
            register={register}
            error={errors.password}
          />
        </div>
      )}
      <SubmitButton isSubmitting={isSubmitting} />

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
