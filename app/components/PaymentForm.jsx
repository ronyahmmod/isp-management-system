"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Banknote, Loader, Loader2 } from "lucide-react";

export default function PaymentForm({ billingId, amount }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    if (!confirm(`Confirm collection of ${amount} in cash?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/billings/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ billingId }),
      });
      if (res.ok) {
        alert("Payment recorded successfully");
        router.push("/dashboard/billing");
        router.refresh();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to record payment");
      }
    } catch (err) {
      alert(err.message || "Failed to record payment");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-4">
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Banknote size={24} />
        )}
        {loading ? "Processing..." : "Confirm Cash Payment"}
      </button>
      <p className="text-center text-xs text-gray-500">
        By clicking Confirm Cash Payment, you acknowledge that you have received
        the full amount in cash.
      </p>
    </div>
  );
}
