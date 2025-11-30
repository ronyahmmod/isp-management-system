// app/dashboard/admin/users/create/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link for declarative navigation

export default function CreateUserPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });
  // State to handle loading feedback for the button
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true); // Disable button and show loading state

    try {
      const res = await fetch("/api/users/create", {
        method: "POST",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json", // Explicitly set content type
        },
      });

      if (!res.ok) {
        // Handle specific errors if the API provides them (e.g., email already exists)
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create user");
      }

      // Success: redirect back to the user list
      router.push("/dashboard/admin/users");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false); // Re-enable button if an error occurred
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Create New User
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={form.name}
            placeholder="John Doe"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            placeholder="john@example.com"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={form.password}
            placeholder="Set a secure password"
            onChange={handleChange}
            required
            minLength="6"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg bg-white dark:bg-gray-900 focus:ring-blue-500 focus:border-blue-500"
            value={form.role}
          >
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
          </select>
        </div>

        {/* Action Buttons Group */}
        <div className="flex gap-4 pt-4">
          <button
            type="button" // Use type="button" to prevent default form submission
            onClick={() => router.push("/dashboard/admin/users")}
            className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-150"
          >
            Cancel
          </button>

          {/* Main submit button with loading state */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
          >
            {isSubmitting ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}
