"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Method = "POST" | "PATCH" | "DELETE";

/**
 * Thin wrapper around an action button that performs a state-changing API call
 * (publish/unpublish/archive) and refreshes the current route on success.
 */
export function ActionButton({
  endpoint,
  method = "POST",
  confirmText,
  className,
  children,
}: {
  endpoint: string;
  method?: Method;
  confirmText?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (confirmText && !window.confirm(confirmText)) return;
    setPending(true);
    try {
      const res = await fetch(endpoint, { method });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        alert(body?.error?.message ?? "Terjadi kesalahan.");
        return;
      }
      router.refresh();
    } catch {
      alert("Ups, ada sedikit gangguan. Coba lagi.");
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={`disabled:opacity-50 ${className ?? ""}`}
    >
      {children}
    </button>
  );
}