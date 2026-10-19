import type { Role } from "@prisma/client";

export type AuthzAction =
  | "cms:access"
  | "content:read"
  | "content:write"
  | "content:publish"
  | "content:unpublish"
  | "content:archive"
  | "sandbox:write"
  | "media:upload"
  | "content:hard-delete"
  | "user:manage-role"
  | "system:settings";

export interface AuthzUser {
  id: string;
  role: Role;
  email?: string | null;
}

/**
 * Central authorization matrix (design-cms.md §2.2).
 * Never check `role === "ADMIN"` directly in application code.
 */
export function can(
  user: AuthzUser | null | undefined,
  action: AuthzAction,
  _resource?: unknown,
): boolean {
  if (!user) return false;

  const role = user.role;

  // SUPER_ADMIN has full access to all capabilities
  if (role === "SUPER_ADMIN") {
    return true;
  }

  // ADMIN capabilities
  if (role === "ADMIN") {
    switch (action) {
      case "cms:access":
      case "content:read":
      case "content:write":
      case "content:publish":
      case "content:unpublish":
      case "content:archive":
      case "sandbox:write":
      case "media:upload":
        return true;
      case "content:hard-delete":
      case "user:manage-role":
      case "system:settings":
        return false;
      default:
        return false;
    }
  }

  // Regular USER has no CMS/admin capabilities
  return false;
}
