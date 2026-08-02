import "server-only";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { auth, LOGIN_PATH } from "@/auth";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) redirect(LOGIN_PATH);
  if (session.user.role !== "admin") redirect(LOGIN_PATH);

  return session.user;
}

/** Route-handler variant — returns JSON 401/403 instead of redirecting. */
export async function requireAdminApi() {
  const session = await auth();

  if (!session?.user) {
    return {
      user: null,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  if (session.user.role !== "admin") {
    return {
      user: null,
      response: NextResponse.json({ message: "Forbidden" }, { status: 403 }),
    };
  }

  return { user: session.user, response: null as NextResponse | null };
}
