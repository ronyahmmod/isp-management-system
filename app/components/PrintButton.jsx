"use client"; // This is required for onClick to work

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-lg text-gray-800 dark:text-gray-100 print:hidden"
    >
      <Printer size={16} /> Print
    </button>
  );
}
