import { ObjectId } from "mongodb";
import { COLLECTIONS, getDb } from "@/lib/db";
import type { Inquiry } from "@/lib/models/types";
import { serialize } from "@/lib/serialize";

export async function getInquiries() {
  try {
    const db = await getDb();
    if (!db) return [];

    const docs = await db
      .collection<Inquiry>(COLLECTIONS.inquiries)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return serialize(docs);
  } catch {
    return [];
  }
}

export async function getInquiryById(id: string) {
  try {
    if (!ObjectId.isValid(id)) return null;

    const db = await getDb();
    if (!db) return null;

    const doc = await db
      .collection<Inquiry>(COLLECTIONS.inquiries)
      .findOne({ _id: new ObjectId(id) });

    return doc ? serialize(doc) : null;
  } catch {
    return null;
  }
}
