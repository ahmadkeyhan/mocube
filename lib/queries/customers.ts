import { COLLECTIONS, getDb } from "@/lib/db";
import type { Customer } from "@/lib/models/types";
import { serialize } from "@/lib/serialize";

export async function getCustomers() {
  try {
    const db = await getDb();
    if (!db) return [];

    const docs = await db
      .collection<Customer>(COLLECTIONS.customers)
      .find({})
      .sort({ name: 1 })
      .toArray();

    return serialize(docs);
  } catch {
    return [];
  }
}

export async function getCustomerBySlug(slug: string) {
  try {
    const db = await getDb();
    if (!db) return null;

    const doc = await db
      .collection<Customer>(COLLECTIONS.customers)
      .findOne({ slug });

    return doc ? serialize(doc) : null;
  } catch {
    return null;
  }
}
