"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePackage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    speed: "",
    price: 0,
    billingCycle: "monthly",
    validityDays: 30,
    description: "",
    status: "active",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch("/api/packages/create", {
      method: "POST",
      body: JSON.stringify(form),
    })
      .then((res) => alert(res.message))
      .catch((error) => alert(error.message));
    router.push("/dashboard/packages");
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Package</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Package Name: Ex- Light"
          value={form.name}
          name="name"
          onChange={handleChange}
          className="border w-full px-3 py-2"
        />
        <input
          type="text"
          name="speed"
          placeholder="Speed: Like 10mbps"
          value={form.speed}
          onChange={handleChange}
          className="border w-full px-3 py-2"
        />
        <input
          type="number"
          name="price"
          placeholder="Price: Like-1000"
          onChange={handleChange}
          className="border w-full px-3 py-2"
          value={form.price}
        />
        <select
          name="billingCycle"
          value={form.billingCycle}
          onChange={handleChange}
          className="border w-full px-3 py-2"
        >
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
          <option value="yearly">Yearly</option>
        </select>
        <input
          type="text"
          name="validityDays"
          placeholder="Validity days: Like-30 for monthly, 7 for weekly"
          onChange={handleChange}
          className="border w-full px-3 py-2"
        />
        <button className="bg-blue-600 dark:bg-gray-700 text-white px-4 py-2 rounded hover:bg-blue-600 hover:dark:bg-gray-600 cursor-pointer">
          Create
        </button>
      </form>
    </div>
  );
}
