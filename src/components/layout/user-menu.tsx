import Link from "next/link";
import { getSessionUser } from "@/server/auth";

/**
 * Server-driven user menu. Shows login when signed out, otherwise the user's
 * name plus admin link (admin is always gated server-side, never by this menu).
 */
export async function UserMenu({ user }: { user: Awaited<ReturnType<typeof getSessionUser>> }) {
  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/80"
      >
        Masuk
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {user.role === "ADMIN" ? (
        <Link
          href="/admin"
          className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-muted"
        >
          Admin
        </Link>
      ) : null}
      <span className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
        {user.name ?? user.email}
      </span>
      <Link
        href="/api/auth/logout"
        className="rounded-md px-2 py-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        Keluar
      </Link>
    </div>
  );
}