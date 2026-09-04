import "server-only";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import {
  auth,
  CALENDAR_LOGIN_PATH,
  CALENDAR_PENDING_PATH,
  LOGIN_PATH,
} from "@/auth";
import { COLLECTIONS, getDb } from "@/lib/db";
import type { Business } from "@/lib/models/types";
import { serialize } from "@/lib/serialize";

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

async function findBusinessForUser(userId: string) {
  if (!ObjectId.isValid(userId)) return null;
  const db = await getDb();
  if (!db) return null;
  const doc = await db
    .collection<Business>(COLLECTIONS.businesses)
    .findOne({ ownerUserId: new ObjectId(userId) });
  return doc ? serialize(doc) : null;
}

export async function requireBusinessAccount() {
  const session = await auth();
  if (!session?.user) redirect(CALENDAR_LOGIN_PATH);
  if (session.user.role !== "business") redirect(CALENDAR_LOGIN_PATH);

  const business = await findBusinessForUser(session.user.id);
  if (!business) redirect(CALENDAR_LOGIN_PATH);
  return { user: session.user, business };
}

export async function requireBusiness() {
  const { user, business } = await requireBusinessAccount();
  if (business.status !== "active") redirect(CALENDAR_PENDING_PATH);
  return { user, business };
}
