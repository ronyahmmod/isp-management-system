"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCustomer() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    package: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch("/api/customers/create", {
      method: "POST",
      body: JSON.stringify(form),
    }).then(() => alert("success"));

    router.push("/dashboard/customers");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Customer</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {Object.keys(form).map((k) => (
          <input
            key={k}
            type="text"
            placeholder={k.toUpperCase()}
            value={form[k]}
            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            className="border w-full px-3 py-2"
          />
        ))}

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Create
        </button>
      </form>
    </div>
  );
}
