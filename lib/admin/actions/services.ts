"use server";

import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import { SERVICE_COLORS } from "@/lib/admin/constants";
import {
  boolean,
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
import type { PricingPlan, Service, ServiceColor } from "@/lib/models/types";

const LIST_PATH = "/admin/services";

function parsePricingPlans(form: FormData): PricingPlan[] {
  const count = integer(form, "plan-count", 0);
  const plans: PricingPlan[] = [];

  for (let index = 0; index < count; index += 1) {
    const name = text(form, `plan-name-${index}`);
    const priceLabel = text(form, `plan-price-${index}`);
    const features = text(form, `plan-features-${index}`)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (!name && !priceLabel && features.length === 0) continue;

    plans.push({
      name,
      priceLabel,
      features,
      highlighted: boolean(form, `plan-highlighted-${index}`),
    });
  }

  return plans;
}

function parse(form: FormData) {
  const errors = new FieldErrors();
  const color = text(form, "color") as ServiceColor;

  if (!SERVICE_COLORS.includes(color)) {
    errors.add("color", "رنگ سرویس را انتخاب کنید.");
  }

  const doc = {
    slug: slug(form, "slug", errors),
    name: requiredText(form, "name", errors, "نام سرویس"),
    color,
    shortDescription: text(form, "shortDescription"),
    description: text(form, "description"),
    pricingPlans: parsePricingPlans(form),
    sortOrder: integer(form, "sortOrder", 0),
  };

  return { doc, errors };
}

export async function createService(
  _prevState: FormState | undefined,
  form: FormData,
): Promise<FormState> {
  await requireAdmin();

  const { doc, errors } = parse(form);
  if (errors.hasAny) return errors.toState();

  const db = await getDb();
  if (!db) return { message: "اتصال به پایگاه داده برقرار نشد." };

  try {
    await db
      .collection<Service>(COLLECTIONS.services)
      .insertOne({ _id: new ObjectId(), ...doc });
  } catch (error) {
    if (isDuplicateKeyError(error)) return duplicateSlugState();
    return { message: "ذخیره سرویس ناموفق بود." };
  }

  redirect(LIST_PATH);
}

export async function updateService(
  _prevState: FormState | undefined,
  form: FormData,
): Promise<FormState> {
  await requireAdmin();

  const id = text(form, "id");
  if (!ObjectId.isValid(id)) return { message: "شناسه نامعتبر است." };

  const { doc, errors } = parse(form);
  if (errors.hasAny) return errors.toState();

  const db = await getDb();
  if (!db) return { message: "اتصال به پایگاه داده برقرار نشد." };

  try {
    await db
      .collection<Service>(COLLECTIONS.services)
      .updateOne({ _id: new ObjectId(id) }, { $set: doc });
  } catch (error) {
    if (isDuplicateKeyError(error)) return duplicateSlugState();
    return { message: "به‌روزرسانی سرویس ناموفق بود." };
  }

  redirect(LIST_PATH);
}

export async function deleteService(form: FormData) {
  await requireAdmin();

  const id = text(form, "id");
  if (!ObjectId.isValid(id)) redirect(LIST_PATH);

  const db = await getDb();
  if (db) {
    await db
      .collection<Service>(COLLECTIONS.services)
      .deleteOne({ _id: new ObjectId(id) });
  }

  redirect(LIST_PATH);
}
