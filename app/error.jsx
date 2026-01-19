// app/error.js (or app/global-error.js)
"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log to your error reporting service (Sentry, LogRocket, etc.)
    console.error("Critical UI Error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Subtle Decorative Element */}
        <div className="mb-8 flex justify-center">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full">
            <svg
              className="w-12 h-12 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Messaging */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
          Something went wrong
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          {error.digest
            ? `We've encountered an unexpected issue (Ref: ${error.digest}). Our team has been notified.`
            : "An unexpected error occurred. We're working on getting things back on track."}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
          >
            Try again
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            Return Home
          </Link>
        </div>

        {/* Subtle Footer */}
        <p className="mt-12 text-sm text-gray-400 dark:text-gray-500">
          If the problem persists, please{" "}
          <Link href="/support" className="underline hover:text-indigo-500">
            contact support
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
