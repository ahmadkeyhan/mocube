import { config } from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import type { Occasion } from "../lib/models/types";

config({ path: ".env.local" });
config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is required.");
  process.exit(1);
}

type Seed = Omit<Occasion, "_id">;

const seeds: Seed[] = [
  {
    slug: "nowruz",
    title: "نوروز",
    description: "آغاز سال نو شمسی",
    scope: "national",
    fieldSlugs: [],
    date: { calendar: "jalali", year: null, month: 1, day: 1 },
    leadTimeDays: 21,
    importance: 3,
    suggestedKind: "campaign",
    active: true,
  },
  {
    slug: "sizdah-bedar",
    title: "سیزده‌به‌در",
    description: "روز طبیعت",
    scope: "national",
    fieldSlugs: [],
    date: { calendar: "jalali", year: null, month: 1, day: 13 },
    leadTimeDays: 10,
    importance: 2,
    suggestedKind: "poster",
    active: true,
  },
  {
    slug: "yalda",
    title: "شب یلدا",
    description: "بلندترین شب سال",
    scope: "national",
    fieldSlugs: [],
    date: { calendar: "jalali", year: null, month: 10, day: 30 },
    leadTimeDays: 14,
    importance: 3,
    suggestedKind: "campaign",
    active: true,
  },
  {
    slug: "teachers-day-ir",
    title: "روز معلم",
    description: "۱۲ اردیبهشت",
    scope: "national",
    fieldSlugs: ["education"],
    date: { calendar: "jalali", year: null, month: 2, day: 12 },
    leadTimeDays: 7,
    importance: 2,
    suggestedKind: "poster",
    active: true,
  },
  {
    slug: "nurses-day-ir",
    title: "روز پرستار",
    description: "۵ اردیبهشت",
    scope: "national",
    fieldSlugs: ["clinic"],
    date: { calendar: "jalali", year: null, month: 2, day: 5 },
    leadTimeDays: 7,
    importance: 2,
    suggestedKind: "poster",
    active: true,
  },
  {
    slug: "tasua",
    title: "تاسوعا",
    description: "نهم محرم",
    scope: "national",
    fieldSlugs: [],
    date: { calendar: "hijri", year: null, month: 1, day: 9 },
    leadTimeDays: 10,
    importance: 3,
    suggestedKind: "poster",
    active: true,
  },
  {
    slug: "ashura",
    title: "عاشورا",
    description: "دهم محرم",
    scope: "national",
    fieldSlugs: [],
    date: { calendar: "hijri", year: null, month: 1, day: 10 },
    leadTimeDays: 10,
    importance: 3,
    suggestedKind: "poster",
    active: true,
  },
  {
    slug: "eid-fitr",
    title: "عید فطر",
    description: "اول شوال",
    scope: "national",
    fieldSlugs: [],
    date: { calendar: "hijri", year: null, month: 10, day: 1 },
    leadTimeDays: 14,
    importance: 3,
    suggestedKind: "campaign",
    active: true,
  },
  {
    slug: "eid-ghadir",
    title: "عید غدیر",
    description: "۱۸ ذی‌الحجه",
    scope: "national",
    fieldSlugs: [],
    date: { calendar: "hijri", year: null, month: 12, day: 18 },
    leadTimeDays: 7,
    importance: 2,
    suggestedKind: "poster",
    active: true,
  },
  {
    slug: "mothers-day-ir",
    title: "روز مادر",
    description: "۲۰ جمادی‌الثانی",
    scope: "national",
    fieldSlugs: [],
    date: { calendar: "hijri", year: null, month: 6, day: 20 },
    leadTimeDays: 10,
    importance: 3,
    suggestedKind: "campaign",
    active: true,
  },
  {
    slug: "fathers-day-ir",
    title: "روز پدر",
    description: "۱۳ رجب",
    scope: "national",
    fieldSlugs: [],
    date: { calendar: "hijri", year: null, month: 7, day: 13 },
    leadTimeDays: 10,
    importance: 2,
    suggestedKind: "poster",
    active: true,
  },
  {
    slug: "labour-day",
    title: "روز جهانی کارگر",
    description: "۱ مه",
    scope: "global",
    fieldSlugs: [],
    date: { calendar: "gregorian", year: null, month: 5, day: 1 },
    leadTimeDays: 7,
    importance: 2,
    suggestedKind: "poster",
    active: true,
  },
  {
    slug: "womens-day",
    title: "روز جهانی زن",
    description: "۸ مارس",
    scope: "global",
    fieldSlugs: [],
    date: { calendar: "gregorian", year: null, month: 3, day: 8 },
    leadTimeDays: 7,
    importance: 2,
    suggestedKind: "poster",
    active: true,
  },
  {
    slug: "valentines",
    title: "ولنتاین",
    description: "۱۴ فوریه",
    scope: "global",
    fieldSlugs: ["cafe", "fashion", "beauty", "retail"],
    date: { calendar: "gregorian", year: null, month: 2, day: 14 },
    leadTimeDays: 10,
    importance: 2,
    suggestedKind: "campaign",
    active: true,
  },
  {
    slug: "coffee-day",
    title: "روز جهانی قهوه",
    description: "۱ اکتبر",
    scope: "global",
    fieldSlugs: ["cafe"],
    date: { calendar: "gregorian", year: null, month: 10, day: 1 },
    leadTimeDays: 10,
    importance: 3,
    suggestedKind: "campaign",
    active: true,
  },
  {
    slug: "hamburger-day",
    title: "روز جهانی همبرگر",
    description: "۲۸ مه",
    scope: "global",
    fieldSlugs: ["cafe"],
    date: { calendar: "gregorian", year: null, month: 5, day: 28 },
    leadTimeDays: 10,
    importance: 2,
    suggestedKind: "campaign",
    active: true,
  },
  {
    slug: "health-day",
    title: "روز جهانی بهداشت",
    description: "۷ آوریل",
    scope: "global",
    fieldSlugs: ["clinic"],
    date: { calendar: "gregorian", year: null, month: 4, day: 7 },
    leadTimeDays: 7,
    importance: 2,
    suggestedKind: "poster",
    active: true,
  },
  {
    slug: "yoga-day",
    title: "روز جهانی یوگا",
    description: "۲۱ ژوئن",
    scope: "global",
    fieldSlugs: ["gym"],
    date: { calendar: "gregorian", year: null, month: 6, day: 21 },
    leadTimeDays: 7,
    importance: 2,
    suggestedKind: "campaign",
    active: true,
  },
  {
    slug: "habitat-day",
    title: "روز جهانی اسکان",
    description: "اولین دوشنبه اکتبر — اینجا ۱ اکتبر",
    scope: "global",
    fieldSlugs: ["realestate"],
    date: { calendar: "gregorian", year: null, month: 10, day: 1 },
    leadTimeDays: 7,
    importance: 1,
    suggestedKind: "poster",
    active: true,
  },
  {
    slug: "fashion-day",
    title: "روز جهانی مد",
    description: "۱۳ اوت",
    scope: "global",
    fieldSlugs: ["fashion", "beauty"],
    date: { calendar: "gregorian", year: null, month: 8, day: 13 },
    leadTimeDays: 7,
    importance: 2,
    suggestedKind: "campaign",
    active: true,
  },
];

async function run() {
  const client = new MongoClient(uri as string);
  await client.connect();
  const db = client.db();
  await db.collection("occasions").createIndex({ slug: 1 }, { unique: true });

  let inserted = 0;
  for (const seed of seeds) {
    const result = await db
      .collection("occasions")
      .updateOne(
        { slug: seed.slug },
        { $setOnInsert: { _id: new ObjectId(), ...seed } },
        { upsert: true },
      );
    if (result.upsertedCount) inserted += 1;
  }

  console.log(
    `Occasions ready. Inserted ${inserted}, catalog size ${seeds.length}.`,
  );
  await client.close();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
