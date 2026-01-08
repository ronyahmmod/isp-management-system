"use client";

import { Loader2, Save } from "lucide-react";

export default function SubmitButton({ isSubmitting }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-blue-600/20 disabled:opacity-50"
    >
      {isSubmitting ? (
        <Loader2 className="animate-spin" size={22} />
      ) : (
        <Save size={22} />
      )}
      {isSubmitting ? "RECORDING..." : "CONFIRM & SAVE"}
    </button>
  );
}
