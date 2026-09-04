"use server";

import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import {
  duplicateSlugState,
  FieldErrors,
  type FormState,
  integer,
  isDuplicateKeyError,
  requiredText,
  slug,
  text,
} from "@/lib/admin/validation";
import { requireAdmin } from "@/lib/auth/guards";
import { COLLECTIONS, getDb } from "@/lib/db";
import { isFieldSlug } from "@/lib/mocalendar/fields";
import type {
  BriefStatus,
  Business,
  BusinessStatus,
  CalendarEntry,
  Occasion,
  OccasionCalendar,
  OccasionKind,
  OccasionScope,
} from "@/lib/models/types";

const OCCASION_LIST = "/admin/mocalendar/occasions";
const BRIEF_LIST = "/admin/mocalendar/briefs";
const BUSINESS_LIST = "/admin/mocalendar/businesses";

const SCOPES = new Set<OccasionScope>(["global", "national"]);
const CALENDARS = new Set<OccasionCalendar>(["gregorian", "jalali", "hijri"]);
const KINDS = new Set<OccasionKind>(["campaign", "poster"]);
const BUSINESS_STATUSES = new Set<BusinessStatus>([
  "pending",
  "active",
  "rejected",
]);
const BRIEF_STATUSES = new Set<BriefStatus>([
  "requested",
  "inDesign",
  "delivered",
  "cancelled",
]);

export async function setBusinessStatus(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  const status = text(form, "status");
  if (
    !ObjectId.isValid(id) ||
    !BUSINESS_STATUSES.has(status as BusinessStatus)
  ) {
    redirect(BUSINESS_LIST);
  }

  const db = await getDb();
  if (db) {
    await db
      .collection<Business>(COLLECTIONS.businesses)
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: status as BusinessStatus } },
      );
  }
  redirect(BUSINESS_LIST);
}

function parseOccasion(form: FormData) {
  const errors = new FieldErrors();
  const scopeRaw = text(form, "scope");
  const calendarRaw = text(form, "calendar");
  const kindRaw = text(form, "suggestedKind");
  const yearRaw = text(form, "year");
  const month = integer(form, "month", 0);
  const day = integer(form, "day", 0);
  const importance = integer(form, "importance", 2);
  const leadTimeDays = integer(form, "leadTimeDays", 7);
  const fieldSlugs = form
    .getAll("fieldSlugs")
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter((value) => isFieldSlug(value));

  if (!SCOPES.has(scopeRaw as OccasionScope)) {
    errors.add("scope", "محدوده را انتخاب کنید.");
  }
  if (!CALENDARS.has(calendarRaw as OccasionCalendar)) {
    errors.add("calendar", "نوع تقویم را انتخاب کنید.");
  }
  if (!KINDS.has(kindRaw as OccasionKind)) {
    errors.add("suggestedKind", "نوع پیشنهادی را انتخاب کنید.");
  }
  if (month < 1 || month > 12) errors.add("month", "ماه نامعتبر است.");
  if (day < 1 || day > 31) errors.add("day", "روز نامعتبر است.");
  if (importance < 1 || importance > 3) {
    errors.add("importance", "اهمیت باید ۱ تا ۳ باشد.");
  }

  let year: number | null = null;
  if (yearRaw) {
    year = Number.parseInt(yearRaw, 10);
    if (Number.isNaN(year) || year < 1) errors.add("year", "سال نامعتبر است.");
  }

  const doc = {
    slug: slug(form, "slug", errors),
    title: requiredText(form, "title", errors, "عنوان"),
    description: text(form, "description"),
    scope: scopeRaw as OccasionScope,
    fieldSlugs,
    date: {
      calendar: calendarRaw as OccasionCalendar,
      year,
      month,
      day,
    },
    leadTimeDays: Math.max(0, leadTimeDays),
    importance,
    suggestedKind: kindRaw as OccasionKind,
    active: form.get("active") !== null,
  };

  return { doc, errors };
}

export async function createOccasion(
  _prevState: FormState | undefined,
  form: FormData,
): Promise<FormState> {
  await requireAdmin();
  const { doc, errors } = parseOccasion(form);
  if (errors.hasAny) return errors.toState();

  const db = await getDb();
  if (!db) return { message: "اتصال به پایگاه داده برقرار نشد." };

  try {
    await db.collection<Occasion>(COLLECTIONS.occasions).insertOne({
      _id: new ObjectId(),
      ...doc,
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) return duplicateSlugState();
    return { message: "ذخیره مناسبت ناموفق بود." };
  }
  redirect(OCCASION_LIST);
}

export async function updateOccasion(
  _prevState: FormState | undefined,
  form: FormData,
): Promise<FormState> {
  await requireAdmin();
  const id = text(form, "id");
  if (!ObjectId.isValid(id)) return { message: "شناسه نامعتبر است." };

  const { doc, errors } = parseOccasion(form);
  if (errors.hasAny) return errors.toState();

  const db = await getDb();
  if (!db) return { message: "اتصال به پایگاه داده برقرار نشد." };

  try {
    await db
      .collection<Occasion>(COLLECTIONS.occasions)
      .updateOne({ _id: new ObjectId(id) }, { $set: doc });
  } catch (error) {
    if (isDuplicateKeyError(error)) return duplicateSlugState();
    return { message: "به‌روزرسانی مناسبت ناموفق بود." };
  }
  redirect(OCCASION_LIST);
}

export async function deleteOccasion(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  const db = await getDb();
  if (db && ObjectId.isValid(id)) {
    await db
      .collection<Occasion>(COLLECTIONS.occasions)
      .deleteOne({ _id: new ObjectId(id) });
  }
  redirect(OCCASION_LIST);
}

export async function setBriefStatus(form: FormData) {
  await requireAdmin();
  const id = text(form, "id");
  const status = text(form, "status");
  const adminNote = text(form, "adminNote");
  if (!ObjectId.isValid(id) || !BRIEF_STATUSES.has(status as BriefStatus)) {
    redirect(BRIEF_LIST);
  }

  const db = await getDb();
  if (db) {
    await db.collection<CalendarEntry>(COLLECTIONS.calendarEntries).updateOne(
      { _id: new ObjectId(id), request: { $ne: null } },
      {
        $set: {
          "request.status": status as BriefStatus,
          "request.adminNote": adminNote,
          "request.deliveredAt": status === "delivered" ? new Date() : null,
        },
      },
    );
  }
  redirect(BRIEF_LIST);
}
