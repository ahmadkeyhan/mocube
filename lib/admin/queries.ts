import "server-only";
import { type Document, ObjectId } from "mongodb";
import { COLLECTIONS, getDb } from "@/lib/db";
import type {
  CalendarEntry,
  Customer,
  MicroService,
  Occasion,
  Project,
  Service,
} from "@/lib/models/types";
import { serialize } from "@/lib/serialize";

async function findById<T extends Document>(
  collection: string,
  id: string,
): Promise<T | null> {
  try {
    if (!ObjectId.isValid(id)) return null;

    const db = await getDb();
    if (!db) return null;

    const doc = await db
      .collection<T>(collection)
      // biome-ignore lint/suspicious/noExplicitAny: generic collection filter
      .findOne({ _id: new ObjectId(id) } as any);

    return (doc as T | null) ?? null;
  } catch {
    return null;
  }
}

export async function getProjectById(id: string) {
  const doc = await findById<Project>(COLLECTIONS.projects, id);
  return doc ? serialize(doc) : null;
}

export async function getCustomerById(id: string) {
  const doc = await findById<Customer>(COLLECTIONS.customers, id);
  return doc ? serialize(doc) : null;
}

export async function getServiceById(id: string) {
  const doc = await findById<Service>(COLLECTIONS.services, id);
  return doc ? serialize(doc) : null;
}

export async function getMicroServiceById(id: string) {
  const doc = await findById<MicroService>(COLLECTIONS.microServices, id);
  return doc ? serialize(doc) : null;
}

export async function getOccasionById(id: string) {
  const doc = await findById<Occasion>(COLLECTIONS.occasions, id);
  return doc ? serialize(doc) : null;
}

export async function getCalendarEntryById(id: string) {
  const doc = await findById<CalendarEntry>(COLLECTIONS.calendarEntries, id);
  return doc ? serialize(doc) : null;
}

export async function getAdminCounts() {
  try {
    const db = await getDb();
    if (!db) return null;

    const [
      projects,
      customers,
      services,
      microServices,
      inquiries,
      unreadInquiries,
      pendingBusinesses,
      openBriefs,
    ] = await Promise.all([
      db.collection(COLLECTIONS.projects).countDocuments(),
      db.collection(COLLECTIONS.customers).countDocuments(),
      db.collection(COLLECTIONS.services).countDocuments(),
      db.collection(COLLECTIONS.microServices).countDocuments(),
      db.collection(COLLECTIONS.inquiries).countDocuments(),
      db.collection(COLLECTIONS.inquiries).countDocuments({ read: false }),
      db
        .collection(COLLECTIONS.businesses)
        .countDocuments({ status: "pending" }),
      db.collection(COLLECTIONS.calendarEntries).countDocuments({
        "request.status": { $in: ["requested", "inDesign"] },
      }),
    ]);

    return {
      projects,
      customers,
      services,
      microServices,
      inquiries,
      unreadInquiries,
      pendingBusinesses,
      openBriefs,
    };
  } catch {
    return null;
  }
}
