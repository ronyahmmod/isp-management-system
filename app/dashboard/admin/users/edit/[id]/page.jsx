"use client";

import useSWR from "swr";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetcher } from "@/lib/fetcher";

export default function EditUserPage({ params }) {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading } = useSWR(`/api/users/${id}`, fetcher);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (!data?.user) return;

    setForm((prev) => {
      const newValues = {
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      };
      if (
        prev.name === newValues.name &&
        prev.email === newValues.email &&
        prev.role === newValues.role
      ) {
        return prev;
      }
      return newValues;
    });
  }, [data]);

  const togglePasswordField = () => {
    setForm((prevState) => {
      const passwordExists = "password" in prevState;
      if (passwordExists) {
        const newFormState = { ...prevState };
        delete newFormState.password;
        return newFormState;
      } else {
        return {
          ...prevState,
          password: "",
        };
      }
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch(`/api/users/update`, {
      body: JSON.stringify({
        id,
        ...form,
      }),
      method: "PUT",
    });
    console.log(res);
    if (!res.ok) {
      alert("Update failed");
      return;
    }
    router.push("/dashboard/admin/users");
  }

  const showPasswordField = "password" in form;

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit User</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border px-3 py-2 w-full"
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border px-3 py-2 w-full"
        />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border px-3 py-2 w-full"
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>

        {form.password !== undefined && (
          <input
            type="password"
            placeholder="New Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border px-3 py-2 w-full"
          />
        )}

        <button
          type="button"
          className="bg-red-600 text-white px-4 py-2 rounded block"
          onClick={() => togglePasswordField()}
        >
          {showPasswordField ? "Remove Password" : "Change Password"}
        </button>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update User
        </button>
      </form>
    </div>
  );
}
