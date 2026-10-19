import { NextResponse } from "next/server";
import { getSessionUser } from "@/server/auth";
import { can } from "@/modules/authz";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  const authenticated = !!user;
  const canAccessCms = can(user, "cms:access");

  return NextResponse.json(
    {
      authenticated,
      canAccessCms,
      user: user
        ? {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        : null,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    },
  );
}
