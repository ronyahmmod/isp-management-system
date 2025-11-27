// components/Topbar.jsx
"use client";
import { signOut } from "next-auth/react";

export default function Topbar({ user }) {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 rounded bg-gray-100 dark:bg-gray-700">
          ☰
        </button>
        <div className="text-lg font-semibold">Admin Dashboard</div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-700 dark:text-gray-200">
          {user?.name}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-3 py-1 bg-red-600 text-white rounded"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
