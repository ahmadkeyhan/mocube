import "server-only";
import { ObjectId } from "mongodb";
import { COLLECTIONS, getDb } from "@/lib/db";
import type {
  Business,
  CalendarEntry,
  CalendarEntryWithBusiness,
  Occasion,
} from "@/lib/models/types";
import { serialize } from "@/lib/serialize";

export async function getBusinessByOwnerId(userId: string) {
  try {
    if (!ObjectId.isValid(userId)) return null;
    const db = await getDb();
    if (!db) return null;
    const doc = await db
      .collection<Business>(COLLECTIONS.businesses)
      .findOne({ ownerUserId: new ObjectId(userId) });
    return doc ? serialize(doc) : null;
  } catch {
    return null;
  }
}

export async function getBusinessByShareToken(token: string) {
  try {
    if (!token) return null;
    const db = await getDb();
    if (!db) return null;
    const doc = await db
      .collection<Business>(COLLECTIONS.businesses)
      .findOne({ shareToken: token, status: "active" });
    return doc ? serialize(doc) : null;
  } catch {
    return null;
  }
}

export async function getBusinesses() {
  try {
    const db = await getDb();
    if (!db) return [];
    const docs = await db
      .collection<Business>(COLLECTIONS.businesses)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return serialize(docs);
  } catch {
    return [];
  }
}

export async function getActiveOccasions() {
  try {
    const db = await getDb();
    if (!db) return [];
    const docs = await db
      .collection<Occasion>(COLLECTIONS.occasions)
      .find({ active: true })
      .toArray();
    return serialize(docs);
  } catch {
    return [];
  }
}

export async function getOccasions() {
  try {
    const db = await getDb();
    if (!db) return [];
    const docs = await db
      .collection<Occasion>(COLLECTIONS.occasions)
      .find({})
      .sort({ title: 1 })
      .toArray();
    return serialize(docs);
  } catch {
    return [];
  }
}

export async function getEntriesInRange(
  businessId: string,
  start: Date,
  end: Date,
) {
  try {
    if (!ObjectId.isValid(businessId)) return [];
    const db = await getDb();
    if (!db) return [];
    const docs = await db
      .collection<CalendarEntry>(COLLECTIONS.calendarEntries)
      .find({
        businessId: new ObjectId(businessId),
        date: { $gte: start, $lt: end },
      })
      .sort({ date: 1, createdAt: 1 })
      .toArray();
    return serialize(docs);
  } catch {
    return [];
  }
}

export async function getEntriesByDate(businessId: string, date: Date) {
  try {
    if (!ObjectId.isValid(businessId)) return [];
    const db = await getDb();
    if (!db) return [];
    const docs = await db
      .collection<CalendarEntry>(COLLECTIONS.calendarEntries)
      .find({ businessId: new ObjectId(businessId), date })
      .sort({ createdAt: 1 })
      .toArray();
    return serialize(docs);
  } catch {
    return [];
  }
}

export async function getBriefs() {
  try {
    const db = await getDb();
    if (!db) return [];
    const docs = await db
      .collection<CalendarEntry>(COLLECTIONS.calendarEntries)
      .find({ request: { $ne: null } })
      .sort({ "request.requestedAt": -1 })
      .toArray();

    const businessIds = [
      ...new Set(docs.map((doc) => doc.businessId.toHexString())),
    ].filter((id) => ObjectId.isValid(id));

    const businesses =
      businessIds.length > 0
        ? await db
            .collection<Business>(COLLECTIONS.businesses)
            .find({
              _id: { $in: businessIds.map((id) => new ObjectId(id)) },
            })
            .toArray()
        : [];
    const byId = new Map(
      businesses.map((business) => [business._id.toHexString(), business]),
    );

    const joined: CalendarEntryWithBusiness[] = docs.map((doc) => ({
      ...doc,
      business: byId.get(doc.businessId.toHexString()) ?? null,
    }));
    return serialize(joined);
  } catch {
    return [];
  }
}
