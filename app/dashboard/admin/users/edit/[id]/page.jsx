"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetcher } from "@/lib/fetcher";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userUpdateSchema } from "@/lib/validation/userSchema";
import FormInput from "@/app/components/ui/FormInput";
import SubmitButton from "@/app/components/ui/SubmitButton";
import TableSkeleton from "@/app/components/TableSkeleton";

export default function EditUserPage({ params }) {
  const { id } = useParams();
  const router = useRouter();
  const [isChangePassword, setIsChangePassword] = useState(false);

  const { data, isLoading } = useSWR(`/api/users/${id}`, fetcher);
  const user = data?.user;

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(userUpdateSchema),
    values: user
      ? {
          name: user.name,
          email: user.email,
          role: user.role,
        }
      : undefined,
  });

  const onError = (errors) => {
    console.log("Form errors", errors);
  };

  const togglePasswordField = () => {
    if (isChangePassword) {
      // If we are closing the field, remove the password value from form state
      resetField("password");
    }
    setIsChangePassword(!isChangePassword);
  };

  async function onSubmit(values) {
    try {
      // Create the payload
      const payload = {
        id: user?._id,
        name: values.name,
        email: values.email,
        role: values.role,
      };

      // Only add password if the field is active and has a value
      if (isChangePassword && values.password) {
        payload.password = values.password;
      }

      const res = await fetch(`/api/users/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        // Use the Zod handling we discussed earlier if server returns validation errors
        if (result.type === "validation") {
          Object.keys(result.details).forEach((field) => {
            setError(field, { message: result.details[field][0] });
          });
        } else {
          alert(result.error || "Update failed");
        }
        return;
      }

      router.push("/dashboard/admin/users");
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  }

  if (isLoading) return <TableSkeleton />;

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onError={onError}
        className="space-y-8"
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Edit User
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Name"
            name="name"
            register={register}
            error={errors.name}
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            register={register}
            error={errors.email}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <FormInput
            label="Role"
            name="role"
            type="select"
            options={[
              { value: "employee", label: "Employee" },
              { value: "admin", label: "Admin" },
            ]}
            register={register}
            error={errors.role}
          />
        </div>

        {isChangePassword && (
          <div className="grid grid-cols-1 gap-4">
            <FormInput
              label="New Password"
              name="password"
              type="password"
              register={register}
              error={errors.password}
            />
          </div>
        )}

        <button
          type="button"
          className="bg-red-600 hover:bg-red-700 rounded-lg text-white px-4 py-4 font-bold block"
          onClick={() => togglePasswordField()}
        >
          {isChangePassword ? "Remove Password" : "Change Password"}
        </button>

        <SubmitButton isSubmitting={isSubmitting} label="Update User" />
      </form>
    </div>
  );
}
