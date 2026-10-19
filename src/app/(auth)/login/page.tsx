"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, AlertCircle, Loader2, Sparkles, UserPlus } from "lucide-react";

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error || "Email atau kata sandi tidak sesuai.");
        setLoading(false);
        return;
      }

      // Successful login
      const userRole = data?.user?.role;
      // If student and next was /admin, redirect to / instead
      if (userRole === "USER" && nextParam.startsWith("/admin")) {
        router.push("/");
      } else {
        router.push(nextParam);
      }
      router.refresh();
    } catch {
      setError("Terjadi gangguan jaringan. Silakan periksa koneksi Anda.");
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border-2 border-stone-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(24,24,27,0.9)] sm:p-8 dark:border-stone-100 dark:bg-stone-900 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.85)]">
      {/* Brand Header */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-stone-900 bg-blue-600 text-white shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] dark:border-white">
          <Sparkles className="h-6 w-6" />
        </div>
        <h1 className="mt-3 text-2xl font-black tracking-tight text-stone-900 dark:text-white">
          Masuk ke IVE-APP
        </h1>
        <p className="mt-1 text-xs text-stone-600 dark:text-stone-400">
          Gunakan akun siswa atau admin Anda untuk melanjutkan pembelajaran.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          className="mb-5 flex items-center gap-2.5 rounded-xl border-2 border-red-500 bg-red-50 p-3 text-xs font-bold text-red-800 dark:bg-red-950/40 dark:text-red-200"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-xs font-mono font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200"
          >
            Alamat Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@contoh.com"
            required
            autoComplete="email"
            className="w-full rounded-xl border-2 border-stone-900 bg-stone-50 px-3.5 py-2.5 text-sm font-semibold text-stone-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] placeholder:text-stone-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-white dark:bg-stone-800 dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.7)]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-xs font-mono font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200"
          >
            Kata Sandi
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            className="w-full rounded-xl border-2 border-stone-900 bg-stone-50 px-3.5 py-2.5 text-sm font-semibold text-stone-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] placeholder:text-stone-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-white dark:bg-stone-800 dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.7)]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-stone-900 bg-blue-600 py-3 text-sm font-black text-white shadow-[3px_3px_0px_0px_rgba(24,24,27,0.9)] transition-all hover:bg-blue-700 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(24,24,27,0.9)] disabled:cursor-not-allowed disabled:opacity-60 dark:border-white dark:bg-blue-500"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Memverifikasi...</span>
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              <span>Masuk ke Akun</span>
            </>
          )}
        </button>
      </form>

      {/* Sign Up Link for Students */}
      <div className="mt-6 border-t-2 border-stone-200 pt-5 text-center dark:border-stone-800">
        <p className="text-xs font-medium text-stone-600 dark:text-stone-400">
          Belum memiliki akun pelajar?{" "}
          <Link
            href="/register"
            className="font-bold text-blue-600 hover:underline dark:text-blue-400"
          >
            Buat Akun Siswa Baru →
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-bold">Memuat...</div>}>
      <LoginFormInner />
    </Suspense>
  );
}