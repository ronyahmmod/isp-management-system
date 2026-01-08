"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import FormInput from "@/app/components/ui/FormInput";

export default function ReportFilterForm({ initialFrom, initialTo }) {
  const router = useRouter();
  const { register, handleSubmit } = useForm({
    defaultValues: { from: initialFrom || "", to: initialTo || "" },
  });

  const onSubmit = (data) => {
    const query = new URLSearchParams();
    if (data.from) query.set("from", data.from);
    if (data.to) query.set("to", data.to);
    router.push(`/dashboard/reports/finance?${query.toString()}`);
  };

  return (
    <div className="max-w-4xl mx-auto mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border dark:border-gray-700 print:hidden">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-wrap items-end gap-4"
      >
        {/* Use your FormInput component for the 'from' date */}
        <div className="flex-1 min-w-[150px]">
          <FormInput
            label="From Date"
            name="from"
            type="date"
            register={register}
            // Passing default value via useForm defaultValues
          />
        </div>

        {/* Use your FormInput component for the 'to' date */}
        <div className="flex-1 min-w-[150px]">
          <FormInput
            label="To Date"
            name="to"
            type="date"
            register={register}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Generate
        </button>
      </form>
    </div>
  );
}
