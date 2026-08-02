"use server";

import { redirect } from "next/navigation";
import { type FormState, text } from "@/lib/admin/validation";
import { requireAdmin } from "@/lib/auth/guards";
import { COLLECTIONS, getDb } from "@/lib/db";
import type { SiteSettings } from "@/lib/models/types";

export async function updateSiteSettings(
  _prevState: FormState | undefined,
  form: FormData,
): Promise<FormState> {
  await requireAdmin();

  const doc = {
    phone: text(form, "phone"),
    instagram: text(form, "instagram"),
    telegram: text(form, "telegram"),
    announcement: text(form, "announcement"),
  };

  const db = await getDb();
  if (!db) return { message: "اتصال به پایگاه داده برقرار نشد." };

  try {
    await db
      .collection<SiteSettings>(COLLECTIONS.siteSettings)
      .updateOne({}, { $set: doc }, { upsert: true });
  } catch {
    return { message: "ذخیره تنظیمات ناموفق بود." };
  }

  redirect("/admin/settings?saved=1");
}
