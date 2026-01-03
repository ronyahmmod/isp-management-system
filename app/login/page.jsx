"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, Globe, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials. Please verify your email and password.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-black transition-colors duration-500">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 dark:bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 dark:bg-purple-600/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-[450px]">
        {/* Main Glass Card */}
        <div className="backdrop-blur-2xl bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-2xl rounded-[2.5rem] p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex p-4 rounded-2xl bg-blue-600/10 dark:bg-blue-600/20 mb-4 ring-1 ring-blue-600/20">
              <ShieldCheck
                className="text-blue-600 dark:text-blue-400"
                size={32}
              />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
              ISP <span className="text-blue-600 dark:text-blue-500">PRO</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm font-medium">
              Enterprise Network Management 2025
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-400 text-xs rounded-2xl text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" method="POST">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">
                Admin Access
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors"
                  size={18}
                />
                <input
                  required
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="admin@isp.com"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-1">
                Security Key
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors"
                  size={18}
                />
                <input
                  required
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            {/* Remember Me & Save Password Triggers */}
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="h-5 w-5 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all" />
                  <svg
                    className="absolute inset-0 m-auto h-3 w-3 text-white scale-0 peer-checked:scale-100 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="4"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 group-hover:text-blue-600 transition-colors">
                  Remember Session
                </span>
              </label>
              <button
                type="button"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot Key?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-blue-600/20 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "UNLOCK SYSTEM"
              )}
            </button>
          </form>
        </div>

        {/* Footer Attribution */}
        <div className="mt-10 text-center space-y-2">
          <p className="text-[10px] text-gray-400 dark:text-gray-600 font-bold uppercase tracking-[0.3em]">
            Authorized Access Only
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Developed by{" "}
            <span className="font-bold text-gray-700 dark:text-gray-200">
              Engineer MD. RONY AHMMOD
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
