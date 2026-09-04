"use server";

import { randomBytes } from "node:crypto";
import { hash } from "bcryptjs";
import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import {
  CALENDAR_HOME,
  CALENDAR_LOGIN_PATH,
  CALENDAR_PENDING_PATH,
  signIn,
  signOut,
} from "@/auth";
import {
  FieldErrors,
  type FormState,
  isDuplicateKeyError,
  requiredText,
  text,
} from "@/lib/admin/validation";
import { requireBusiness, requireBusinessAccount } from "@/lib/auth/guards";
import { COLLECTIONS, getDb } from "@/lib/db";
import { utcDateKey, utcMidnight } from "@/lib/jalali";
import { AI_DAILY_CAP, generateCampaignIdeas } from "@/lib/mocalendar/ai";
import { isLateForLead } from "@/lib/mocalendar/calendars";
import { isFieldSlug } from "@/lib/mocalendar/fields";
import type {
  AiIdea,
  AppUser,
  Business,
  CalendarEntry,
  CalendarEntryKind,
  CalendarEntryStatus,
  Occasion,
  OccasionKind,
} from "@/lib/models/types";

const OWN_KINDS = new Set<CalendarEntryKind>(["post", "story", "reel", "note"]);
const OCCASION_KINDS = new Set<CalendarEntryKind>(["campaign", "poster"]);
const ENTRY_STATUSES = new Set<CalendarEntryStatus>([
  "planned",
  "ready",
  "published",
  "skipped",
]);

function newShareToken() {
  return randomBytes(16).toString("hex");
}

export async function calendarLoginAction(
  _prevState: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!username || !password) {
    return { message: "نام کاربری و رمز عبور را وارد کنید." };
  }

  try {
    await signIn("credentials", {
      username,
      password,
      redirectTo: CALENDAR_HOME,
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: "نام کاربری یا رمز عبور نادرست است." };
    }
    throw error;
  }
}

export async function calendarLogoutAction() {
  await signOut({ redirectTo: CALENDAR_LOGIN_PATH });
}

export async function calendarSignupAction(
  _prevState: FormState | undefined,
  form: FormData,
): Promise<FormState> {
  const errors = new FieldErrors();
  const username = requiredText(form, "username", errors, "نام کاربری")
    .toLowerCase()
    .replace(/\s+/g, "");
  const password = requiredText(form, "password", errors, "رمز عبور");
  const name = requiredText(form, "name", errors, "نام کسب‌وکار");

  if (username && !/^[a-z0-9._-]{3,32}$/.test(username)) {
    errors.add("username", "نام کاربری ۳ تا ۳۲ کاراکتر انگلیسی، عدد یا ._-");
  }
  if (password && password.length < 8) {
    errors.add("password", "رمز عبور حداقل ۸ کاراکتر.");
  }
  if (errors.hasAny) return errors.toState();

  const db = await getDb();
  if (!db) return { message: "اتصال به پایگاه داده برقرار نشد." };

  const userId = new ObjectId();
  const businessId = new ObjectId();
  const passwordHash = await hash(password, 12);

  try {
    await db.collection<AppUser>(COLLECTIONS.users).insertOne({
      _id: userId,
      username,
      passwordHash,
      role: "business",
      businessId,
      createdAt: new Date(),
    });
    await db.collection<Business>(COLLECTIONS.businesses).insertOne({
      _id: businessId,
      ownerUserId: userId,
      name,
      fieldSlug: "",
      subTags: [],
      city: "",
      audience: "",
      tone: "",
      instagram: "",
      brandColors: [],
      status: "pending",
      shareToken: newShareToken(),
      aiUsage: { day: "", count: 0 },
      createdAt: new Date(),
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return {
        message: "این نام کاربری قبلاً ثبت شده است.",
        fieldErrors: { username: "نام کاربری تکراری است." },
      };
    }
    return { message: "ثبت‌نام ناموفق بود." };
  }

  try {
    await signIn("credentials", {
      username,
      password,
      redirectTo: CALENDAR_PENDING_PATH,
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      redirect(CALENDAR_LOGIN_PATH);
    }
    throw error;
  }
}

export async function updateBusinessProfile(
  _prevState: FormState | undefined,
  form: FormData,
): Promise<FormState> {
  const { business } = await requireBusiness();
  const errors = new FieldErrors();
  const name = requiredText(form, "name", errors, "نام کسب‌وکار");
  const fieldSlug = text(form, "fieldSlug");
  if (!isFieldSlug(fieldSlug)) {
    errors.add("fieldSlug", "حوزه کسب‌وکار را انتخاب کنید.");
  }
  if (errors.hasAny) return errors.toState();

  const db = await getDb();
  if (!db) return { message: "اتصال به پایگاه داده برقرار نشد." };

  const subTags = text(form, "subTags")
    .split(/[،,]/)
    .map((item) => item.trim())
    .filter(Boolean);
  const brandColors = text(form, "brandColors")
    .split(/[،,\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  await db.collection<Business>(COLLECTIONS.businesses).updateOne(
    { _id: new ObjectId(business._id) },
    {
      $set: {
        name,
        fieldSlug,
        subTags,
        city: text(form, "city"),
        audience: text(form, "audience"),
        tone: text(form, "tone"),
        instagram: text(form, "instagram").replace(/^@/, ""),
        brandColors,
      },
    },
  );

  redirect(CALENDAR_HOME);
}

function parseKind(raw: string, allowed: Set<CalendarEntryKind>) {
  return allowed.has(raw as CalendarEntryKind)
    ? (raw as CalendarEntryKind)
    : null;
}

export async function createOwnEntry(
  _prevState: FormState | undefined,
  form: FormData,
): Promise<FormState> {
  const { business } = await requireBusiness();
  const errors = new FieldErrors();
  const dateKey = text(form, "date");
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) errors.add("date", "تاریخ نامعتبر است.");
  const title = requiredText(form, "title", errors, "عنوان");
  const kind = parseKind(text(form, "kind"), OWN_KINDS);
  if (!kind) errors.add("kind", "نوع محتوا را انتخاب کنید.");
  if (errors.hasAny) return errors.toState();

  const db = await getDb();
  if (!db) return { message: "اتصال به پایگاه داده برقرار نشد." };

  await db.collection<CalendarEntry>(COLLECTIONS.calendarEntries).insertOne({
    _id: new ObjectId(),
    businessId: new ObjectId(business._id),
    date: utcMidnight(date),
    kind: kind as CalendarEntryKind,
    title,
    notes: text(form, "notes"),
    occasionSlug: null,
    status: "planned",
    ideas: [],
    request: null,
    createdAt: new Date(),
  });

  redirect(`/calendar/day/${dateKey}`);
}

export async function updateOwnEntry(
  _prevState: FormState | undefined,
  form: FormData,
): Promise<FormState> {
  const { business } = await requireBusiness();
  const id = text(form, "id");
  const dateKey = text(form, "date");
  if (!ObjectId.isValid(id)) return { message: "شناسه نامعتبر است." };

  const errors = new FieldErrors();
  const title = requiredText(form, "title", errors, "عنوان");
  const kind = parseKind(text(form, "kind"), OWN_KINDS);
  const statusRaw = text(form, "status");
  const status = ENTRY_STATUSES.has(statusRaw as CalendarEntryStatus)
    ? (statusRaw as CalendarEntryStatus)
    : "planned";
  if (!kind) errors.add("kind", "نوع محتوا را انتخاب کنید.");
  if (errors.hasAny) return errors.toState();

  const db = await getDb();
  if (!db) return { message: "اتصال به پایگاه داده برقرار نشد." };

  await db
    .collection<CalendarEntry>(COLLECTIONS.calendarEntries)
    .updateOne(
      { _id: new ObjectId(id), businessId: new ObjectId(business._id) },
      {
        $set: {
          title,
          notes: text(form, "notes"),
          kind: kind as CalendarEntryKind,
          status,
        },
      },
    );

  redirect(`/calendar/day/${dateKey}`);
}

export async function deleteOwnEntry(form: FormData) {
  const { business } = await requireBusiness();
  const id = text(form, "id");
  const db = await getDb();
  let dateKey = text(form, "date");
  if (db && ObjectId.isValid(id)) {
    const entry = await db
      .collection<CalendarEntry>(COLLECTIONS.calendarEntries)
      .findOne({
        _id: new ObjectId(id),
        businessId: new ObjectId(business._id),
        request: null,
      });
    if (entry) dateKey = utcDateKey(entry.date);
    await db.collection<CalendarEntry>(COLLECTIONS.calendarEntries).deleteOne({
      _id: new ObjectId(id),
      businessId: new ObjectId(business._id),
      request: null,
    });
  }
  redirect(dateKey ? `/calendar/day/${dateKey}` : CALENDAR_HOME);
}

export async function decideOccasion(
  _prevState: FormState | undefined,
  form: FormData,
): Promise<FormState> {
  const { business } = await requireBusiness();
  const dateKey = text(form, "date");
  const date = new Date(`${dateKey}T00:00:00.000Z`);
  const occasionSlug = text(form, "occasionSlug");
  const decision = text(form, "decision");
  const kind =
    decision === "skip" ? "skipped" : parseKind(decision, OCCASION_KINDS);

  if (Number.isNaN(date.getTime()) || !occasionSlug || !kind) {
    return { message: "تصمیم نامعتبر است." };
  }

  const db = await getDb();
  if (!db) return { message: "اتصال به پایگاه داده برقرار نشد." };

  const occasion = await db
    .collection<Occasion>(COLLECTIONS.occasions)
    .findOne({ slug: occasionSlug, active: true });
  if (!occasion) return { message: "مناسبت پیدا نشد." };

  const existing = await db
    .collection<CalendarEntry>(COLLECTIONS.calendarEntries)
    .findOne({
      businessId: new ObjectId(business._id),
      date: utcMidnight(date),
      occasionSlug,
    });

  const title =
    kind === "skipped"
      ? `رد ${occasion.title}`
      : `${kind === "campaign" ? "کمپین" : "پوستر"} ${occasion.title}`;

  if (existing) {
    await db.collection<CalendarEntry>(COLLECTIONS.calendarEntries).updateOne(
      { _id: existing._id },
      {
        $set: {
          kind: kind === "skipped" ? "note" : kind,
          title,
          status: kind === "skipped" ? "skipped" : "planned",
        },
      },
    );
  } else {
    await db.collection<CalendarEntry>(COLLECTIONS.calendarEntries).insertOne({
      _id: new ObjectId(),
      businessId: new ObjectId(business._id),
      date: utcMidnight(date),
      kind: kind === "skipped" ? "note" : kind,
      title,
      notes: "",
      occasionSlug,
      status: kind === "skipped" ? "skipped" : "planned",
      ideas: [],
      request: null,
      createdAt: new Date(),
    });
  }

  redirect(`/calendar/day/${dateKey}`);
}

export async function decideOccasionForm(form: FormData): Promise<void> {
  const result = await decideOccasion(undefined, form);
  if (result.message) {
    throw new Error(result.message);
  }
}

async function consumeAiCredit(business: { _id: string }) {
  const db = await getDb();
  if (!db) throw new Error("اتصال به پایگاه داده برقرار نشد.");
  const today = utcDateKey(new Date());
  const current = await db
    .collection<Business>(COLLECTIONS.businesses)
    .findOne({ _id: new ObjectId(business._id) });
  if (!current) throw new Error("کسب‌وکار پیدا نشد.");

  const used = current.aiUsage.day === today ? current.aiUsage.count : 0;
  if (used >= AI_DAILY_CAP) {
    throw new Error(`سقف روزانه تولید ایده (${AI_DAILY_CAP}) پر شده است.`);
  }

  await db
    .collection<Business>(COLLECTIONS.businesses)
    .updateOne(
      { _id: current._id },
      { $set: { aiUsage: { day: today, count: used + 1 } } },
    );
}

export async function generateEntryIdeas(
  _prevState: FormState | undefined,
  form: FormData,
): Promise<FormState> {
  const { business } = await requireBusiness();
  const id = text(form, "id");
  const dateKey = text(form, "date");
  const feedback = text(form, "feedback");
  if (!ObjectId.isValid(id)) return { message: "شناسه نامعتبر است." };

  const db = await getDb();
  if (!db) return { message: "اتصال به پایگاه داده برقرار نشد." };

  const entry = await db
    .collection<CalendarEntry>(COLLECTIONS.calendarEntries)
    .findOne({
      _id: new ObjectId(id),
      businessId: new ObjectId(business._id),
    });
  if (!entry || !entry.occasionSlug) {
    return { message: "ابتدا کمپین یا پوستر را انتخاب کنید." };
  }

  const occasion = await db
    .collection<Occasion>(COLLECTIONS.occasions)
    .findOne({ slug: entry.occasionSlug });
  if (!occasion) return { message: "مناسبت پیدا نشد." };

  const kind: OccasionKind = entry.kind === "campaign" ? "campaign" : "poster";

  try {
    await consumeAiCredit(business);
    const ideas = await generateCampaignIdeas({
      business,
      occasionTitle: occasion.title,
      occasionDescription: occasion.description,
      kind,
      feedback,
    });
    await db
      .collection<CalendarEntry>(COLLECTIONS.calendarEntries)
      .updateOne({ _id: entry._id }, { $set: { ideas } });
  } catch (error) {
    return {
      message:
        error instanceof Error ? error.message : "تولید ایده ناموفق بود.",
    };
  }

  redirect(`/calendar/day/${dateKey}`);
}

export async function requestBrief(
  _prevState: FormState | undefined,
  form: FormData,
): Promise<FormState> {
  const { business } = await requireBusiness();
  const id = text(form, "id");
  const dateKey = text(form, "date");
  const ideaIndex = Number.parseInt(text(form, "ideaIndex"), 10);
  if (!ObjectId.isValid(id) || Number.isNaN(ideaIndex)) {
    return { message: "درخواست نامعتبر است." };
  }

  const db = await getDb();
  if (!db) return { message: "اتصال به پایگاه داده برقرار نشد." };

  const entry = await db
    .collection<CalendarEntry>(COLLECTIONS.calendarEntries)
    .findOne({
      _id: new ObjectId(id),
      businessId: new ObjectId(business._id),
    });
  const idea: AiIdea | undefined = entry?.ideas[ideaIndex];
  if (!entry || !idea) return { message: "ایده پیدا نشد." };
  if (entry.request && entry.request.status !== "cancelled") {
    return { message: "برای این روز قبلاً درخواست ثبت شده است." };
  }

  const occasion = entry.occasionSlug
    ? await db
        .collection<Occasion>(COLLECTIONS.occasions)
        .findOne({ slug: entry.occasionSlug })
    : null;
  const lead = occasion?.leadTimeDays ?? 5;
  const dueDate = utcMidnight(entry.date);
  dueDate.setUTCDate(dueDate.getUTCDate() - lead);

  await db.collection<CalendarEntry>(COLLECTIONS.calendarEntries).updateOne(
    { _id: entry._id },
    {
      $set: {
        status: "ready",
        request: {
          status: "requested",
          idea,
          requestedAt: new Date(),
          dueDate,
          deliveredAt: null,
          adminNote: isLateForLead(entry.date, lead) ? "درخواست دیرهنگام" : "",
        },
      },
    },
  );

  redirect(`/calendar/day/${dateKey}`);
}

export async function rotateShareToken() {
  const { business } = await requireBusinessAccount();
  const db = await getDb();
  if (!db) return;
  await db
    .collection<Business>(COLLECTIONS.businesses)
    .updateOne(
      { _id: new ObjectId(business._id) },
      { $set: { shareToken: newShareToken() } },
    );
  redirect("/calendar/profile");
}
