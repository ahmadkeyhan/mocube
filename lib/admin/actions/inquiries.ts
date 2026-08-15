"use server";

import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { text } from "@/lib/admin/validation";
import { requireAdmin } from "@/lib/auth/guards";
import { COLLECTIONS, getDb } from "@/lib/db";
import type { Inquiry } from "@/lib/models/types";

const LIST_PATH = "/admin/inquiries";

export async function markInquiryRead(id: string) {
  await requireAdmin();
  if (!ObjectId.isValid(id)) return;

  const db = await getDb();
  if (!db) return;

  await db
    .collection<Inquiry>(COLLECTIONS.inquiries)
    .updateOne({ _id: new ObjectId(id) }, { $set: { read: true } });
}

export async function deleteInquiry(form: FormData) {
  await requireAdmin();

  const id = text(form, "id");
  if (!ObjectId.isValid(id)) redirect(LIST_PATH);

  const db = await getDb();
  if (db) {
    await db
      .collection<Inquiry>(COLLECTIONS.inquiries)
      .deleteOne({ _id: new ObjectId(id) });
  }

  redirect(LIST_PATH);
}
