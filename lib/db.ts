import { type Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createClientPromise(): Promise<MongoClient> | null {
  if (!uri) return null;

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }

  const client = new MongoClient(uri);
  return client.connect();
}

const clientPromise = createClientPromise();

export async function getDb(): Promise<Db | null> {
  if (!clientPromise) return null;
  try {
    const client = await clientPromise;
    const db = client.db();
    await db.command({ ping: 1 });
    return db;
  } catch {
    return null;
  }
}

export const COLLECTIONS = {
  services: "services",
  microServices: "microServices",
  customers: "customers",
  projects: "projects",
  siteSettings: "siteSettings",
  users: "users",
  inquiries: "inquiries",
  businesses: "businesses",
  occasions: "occasions",
  calendarEntries: "calendarEntries",
} as const;
