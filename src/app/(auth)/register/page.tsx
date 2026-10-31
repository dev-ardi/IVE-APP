"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, AlertCircle, Loader2, GraduationCap, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password || !confirmPassword) {
      setError("Semua field wajib diisi.");
      return;
    }

    if (password.length < 6) {
      setError("Kata sandi minimal harus 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok dengan kata sandi.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error || "Gagal membuat akun.");
        setLoading(false);
        return;
      }

      // Successful registration: auto logged in with role USER
      router.push("/");
      router.refresh();
    } catch {
      setError("Terjadi gangguan jaringan. Silakan coba kembali.");
      setLoading(false);
    }
  }

  return (
    <div className="neo-card p-6 sm:p-8">
      {/* Brand Header */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-stone-900 bg-emerald-600 text-white shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] dark:border-white">
          <GraduationCap className="h-6 w-6" />
        </div>
        <h1 className="mt-3 text-2xl font-black tracking-tight text-stone-900 dark:text-white">
          Daftar Akun Siswa
        </h1>
        <p className="mt-1 text-xs text-stone-600 dark:text-stone-400">
          Buat akun pelajar gratis untuk menyimpan riwayat kuis, materi favorit, dan progres belajar Anda.
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

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="name"
            className="text-xs font-mono font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200"
          >
            Nama Lengkap / Panggilan
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Budi Santoso"
            autoComplete="name"
            className="w-full rounded-xl border-2 border-stone-900 bg-stone-50 px-3.5 py-2.5 text-sm font-semibold text-stone-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] placeholder:text-stone-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-white dark:bg-stone-800 dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.7)]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-xs font-mono font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200"
          >
            Alamat Email <span className="text-red-500">*</span>
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
            Kata Sandi <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            required
            autoComplete="new-password"
            className="w-full rounded-xl border-2 border-stone-900 bg-stone-50 px-3.5 py-2.5 text-sm font-semibold text-stone-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] placeholder:text-stone-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-white dark:bg-stone-800 dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.7)]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="confirmPassword"
            className="text-xs font-mono font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200"
          >
            Konfirmasi Kata Sandi <span className="text-red-500">*</span>
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ulangi kata sandi"
            required
            autoComplete="new-password"
            className="w-full rounded-xl border-2 border-stone-900 bg-stone-50 px-3.5 py-2.5 text-sm font-semibold text-stone-900 shadow-[2px_2px_0px_0px_rgba(24,24,27,0.9)] placeholder:text-stone-400 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-white dark:bg-stone-800 dark:text-white dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.7)]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-stone-900 bg-emerald-600 py-3 text-sm font-black text-white shadow-[3px_3px_0px_0px_rgba(24,24,27,0.9)] transition-all hover:bg-emerald-700 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(24,24,27,0.9)] disabled:cursor-not-allowed disabled:opacity-60 dark:border-white dark:bg-emerald-500"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Mendaftarkan akun...</span>
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              <span>Daftar Akun Siswa</span>
            </>
          )}
        </button>
      </form>

      {/* Login link */}
      <div className="mt-6 border-t-2 border-stone-200 pt-5 text-center dark:border-stone-800">
        <p className="text-xs font-medium text-stone-600 dark:text-stone-400">
          Sudah memiliki akun?{" "}
          <Link
            href="/login"
            className="font-bold text-blue-600 hover:underline dark:text-blue-400"
          >
            Masuk di sini →
          </Link>
        </p>
      </div>
    </div>
  );
}
