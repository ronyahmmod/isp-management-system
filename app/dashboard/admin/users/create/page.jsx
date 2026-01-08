// app/dashboard/admin/users/create/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link for declarative navigation
import { useForm } from "react-hook-form";
import FormInput from "@/app/components/ui/FormInput";
import SubmitButton from "@/app/components/ui/SubmitButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { userCreateSchema } from "@/lib/validation/userSchema";

export default function CreateUserPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      role: "employee",
    },
  });

  async function onSubmit(data) {
    try {
      const res = await fetch("/api/users/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        // Handle specific errors if the API provides them (e.g., email already exists)
        if (result.type === "validation") {
          Object.keys(result.details).forEach((field) => {
            setError(field, {
              type: "sever",
              message: result.details[field][0],
            });
          });
          return;
        }
        setError("root.serverError", { message: result.error });
        return;
      }

      alert("User created successfully");

      // Success: redirect back to the user list
      router.push("/dashboard/admin/users");
    } catch (error) {
      setError("root.serverError", { message: error.message });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        New User Registration Form
      </h2>

      <div className="grid grid-cols-1 gap-8">
        <FormInput
          label="User fullname"
          placeholder="e.g. Md. Rony Ahmmod"
          register={register}
          error={errors.name}
          name="name"
          rules={{ required: "Every user must have a name" }}
        />
      </div>
      <div className="grid grid-cols-1 gap-8">
        <FormInput
          label="User email"
          placeholder="e.g. rony@gmail.com"
          register={register}
          error={errors.email}
          name="email"
          rules={{ required: "Every user must have a email" }}
        />
      </div>
      <div className="grid grid-cols-1 gap-8">
        <FormInput
          label="User password"
          placeholder="**********"
          register={register}
          type="password"
          error={errors.password}
          name="password"
          rules={{ required: "Every user must have a password" }}
        />
      </div>
      <div className="grid grid-cols-1 gap-8">
        <FormInput
          label="User role"
          register={register}
          type="select"
          error={errors.role}
          name="role"
          options={[
            { value: "employee", label: "Employee" },
            { value: "admin", label: "Admin" },
          ]}
        />
      </div>

      <SubmitButton isSubmitting={isSubmitting} />
      {errors.root?.serverError && (
        <p className="text-red-500">{errors.root.serverError.message}</p>
      )}
    </form>
  );
}
