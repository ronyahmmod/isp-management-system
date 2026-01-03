"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Form, Loader2, Save } from "lucide-react";
import FormInput from "@/app/components/ui/FormInput";

export default function ExpenseForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { date: new Date().toISOString().split("T")[0] },
  });

  async function onSubmit(data) {
    try {
      const response = await fetch("/api/expenses/create", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (response.ok) {
        alert("Expense created successfully");
      }
    } catch (error) {
      setServerError(`Error`);
      console.log(error);
    }

    router.push("/dashboard/expenses");
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
      {serverError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
          {serverError}
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        New Expense
      </h1>

      <div className="grid grid-cols-1 gap-8">
        <FormInput
          label="Expense Purpose"
          name="title"
          register={register}
          error={errors.title}
          placeholder="e.g. Office Rent"
          rules={{ required: "Expense purpose is required" }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormInput
            label="Total amount (৳)"
            name="amount"
            type="number"
            register={register}
            error={errors.amount}
            placeholder="0.00"
            rules={{ required: "Amount is required" }}
          />

          <FormInput
            label="Classification"
            name="category"
            type="select"
            register={register}
            error={errors.category}
            options={[
              "Office Rent",
              "Utility",
              "Marketing",
              "Hardware",
              "Salary",
              "Other",
            ]}
            rules={{ required: "Category is required" }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormInput
            label="Transaction Date"
            name="date"
            type="date"
            register={register}
            error={errors.date}
            rules={{ required: "Date is required" }}
          />
          <FormInput
            label="Description"
            name="description"
            type="textarea"
            register={register}
            error={errors.description}
            placeholder="e.g. Office Rent"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20 disabled:opacity-50"
      >
        {isSubmitting ? (
          <Loader2 className="animate-spin" size={22} />
        ) : (
          <Save size={22} />
        )}
        {isSubmitting ? "RECORDING..." : "CONFIRM & SAVE EXPENSE"}
      </button>
    </form>
  );
}
