import { hash } from "bcryptjs";
import { config } from "dotenv";
import { MongoClient } from "mongodb";

config({ path: ".env.local" });
config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error(
    "MONGODB_URI is required. Copy .env.example to .env.local and set it.",
  );
  process.exit(1);
}

function readFlag(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  if (index !== -1 && process.argv[index + 1]) return process.argv[index + 1];

  const inline = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  return inline?.slice(name.length + 3);
}

const username = (readFlag("username") ?? process.env.ADMIN_USERNAME ?? "")
  .trim()
  .toLowerCase();
const password = readFlag("password") ?? process.env.ADMIN_PASSWORD ?? "";

if (!username || password.length < 8) {
  console.error(
    "Usage: npm run create-admin -- --username admin --password 'at-least-8-chars'",
  );
  process.exit(1);
}

async function createAdmin() {
  const client = new MongoClient(uri as string);
  await client.connect();
  const db = client.db();

  await Promise.all([
    db.collection("users").createIndex({ username: 1 }, { unique: true }),
    db.collection("services").createIndex({ slug: 1 }, { unique: true }),
    db.collection("microServices").createIndex({ slug: 1 }, { unique: true }),
    db.collection("customers").createIndex({ slug: 1 }, { unique: true }),
    db.collection("projects").createIndex({ slug: 1 }, { unique: true }),
    db.collection("inquiries").createIndex({ createdAt: -1 }),
    db
      .collection("businesses")
      .createIndex({ ownerUserId: 1 }, { unique: true }),
    db
      .collection("businesses")
      .createIndex({ shareToken: 1 }, { unique: true, sparse: true }),
    db.collection("occasions").createIndex({ slug: 1 }, { unique: true }),
    db.collection("calendarEntries").createIndex({ businessId: 1, date: 1 }),
    db
      .collection("calendarEntries")
      .createIndex({ "request.status": 1, "request.requestedAt": -1 }),
  ]);

  const passwordHash = await hash(password, 12);

  const result = await db.collection("users").updateOne(
    { username },
    {
      $set: { passwordHash, role: "admin" },
      $setOnInsert: { username, createdAt: new Date() },
    },
    { upsert: true },
  );

  console.log(
    result.upsertedCount > 0
      ? `Admin "${username}" created.`
      : `Admin "${username}" password updated.`,
  );

  await client.close();
}

createAdmin().catch((error) => {
  console.error(error);
  process.exit(1);
});
