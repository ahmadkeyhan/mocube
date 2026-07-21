import { COLLECTIONS, getDb } from "@/lib/db";
import type { Service } from "@/lib/models/types";
import { serialize } from "@/lib/serialize";

export async function getServices() {
  try {
    const db = await getDb();
    if (!db) return [];

    const docs = await db
      .collection<Service>(COLLECTIONS.services)
      .find({})
      .sort({ sortOrder: 1 })
      .toArray();

    return serialize(docs);
  } catch {
    return [];
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    const db = await getDb();
    if (!db) return null;

    const doc = await db
      .collection<Service>(COLLECTIONS.services)
      .findOne({ slug });

    return doc ? serialize(doc) : null;
  } catch {
    return null;
  }
}
