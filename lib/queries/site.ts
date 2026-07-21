import { COLLECTIONS, getDb } from "@/lib/db";
import type { SiteSettings } from "@/lib/models/types";
import { serialize } from "@/lib/serialize";

const fallbackSettings: Omit<SiteSettings, "_id"> & { _id: string } = {
  _id: "fallback",
  phone: "09121234567",
  instagram: "mocube.studio",
  telegram: "mocube",
  announcement: "استودیو خلاق موکیوب — طراحی که دیده می‌شود",
};

export async function getSiteSettings() {
  try {
    const db = await getDb();
    if (!db) return fallbackSettings;

    const doc = await db
      .collection<SiteSettings>(COLLECTIONS.siteSettings)
      .findOne({});

    if (!doc) return fallbackSettings;
    return serialize(doc);
  } catch {
    return fallbackSettings;
  }
}
