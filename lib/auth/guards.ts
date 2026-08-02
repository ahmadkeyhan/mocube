import "server-only";
import { redirect } from "next/navigation";
import { auth, LOGIN_PATH } from "@/auth";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) redirect(LOGIN_PATH);
  if (session.user.role !== "admin") redirect(LOGIN_PATH);

  return session.user;
}
