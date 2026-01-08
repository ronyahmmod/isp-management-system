"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import FormInput from "@/app/components/ui/FormInput";
import SubmitButton from "@/app/components/ui/SubmitButton";

export default function CreatePackage() {
  const router = useRouter();
  const [serverError, setServerError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({});

  const [form, setForm] = useState({
    name: "",
    speed: "",
    price: 0,
    billingCycle: "monthly",
    validityDays: 30,
    description: "",
    status: "active",
  });

  async function onSubmit(data) {
    try {
      const response = await fetch("/api/packages/create", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (response.ok) {
        alert("Package created successfully");
      }
    } catch (error) {
      setServerError(error.message);
      console.log(error);
    }
    router.push("/dashboard/packages");
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
      {serverError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
          {serverError.message}
        </div>
      )}
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Add New Package
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormInput
          name="name"
          label="Package Name"
          register={register}
          error={errors.name}
          placeholder="e.g. SHAPLA"
          rules={{ required: "Package name must be required" }}
        />
        <FormInput
          name="speed"
          label="Speed"
          register={register}
          error={errors.speed}
          placeholder="e.g. 100"
          rules={{ required: "Speed must be required" }}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormInput
          name="price"
          label="Price"
          type="number"
          register={register}
          error={errors.price}
          placeholder="e.g. 100"
          rules={{ required: "Price must be required" }}
        />
        <FormInput
          name="validityDays"
          label="Validity Days"
          type="number"
          register={register}
          error={errors.validityDays}
          placeholder="e.g. 30"
          rules={{ required: "Validity Days must be required" }}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormInput
          name="billingCycle"
          label="Billing Cycle"
          type="select"
          register={register}
          error={errors.billingCycle}
          options={[
            { value: "monthly", label: "Monthly" },
            { value: "yearly", label: "Yearly" },
          ]}
          rules={{ required: "Billing Cycle must be required" }}
        />
        <FormInput
          name="description"
          label="Description"
          register={register}
          error={errors.description}
          placeholder="e.g. Place a short note"
        />
      </div>
      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  );
}
