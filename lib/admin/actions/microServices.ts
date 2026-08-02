"use server";

import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import {
  duplicateSlugState,
  FieldErrors,
  type FormState,
  integer,
  isDuplicateKeyError,
  objectId,
  requiredText,
  slug,
  text,
} from "@/lib/admin/validation";
import { requireAdmin } from "@/lib/auth/guards";
import { COLLECTIONS, getDb } from "@/lib/db";
import type { MicroService } from "@/lib/models/types";

const LIST_PATH = "/admin/microservices";

function parse(form: FormData) {
  const errors = new FieldErrors();
  const serviceId = objectId(form, "serviceId", errors, "خدمت مرتبط");

  const doc = {
    slug: slug(form, "slug", errors),
    name: requiredText(form, "name", errors, "نام ریزخدمت"),
    shortDescription: text(form, "shortDescription"),
    description: text(form, "description"),
    serviceId: serviceId ?? new ObjectId(),
    sortOrder: integer(form, "sortOrder", 0),
  };

  return { doc, errors };
}

export async function createMicroService(
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
      .collection<MicroService>(COLLECTIONS.microServices)
      .insertOne({ _id: new ObjectId(), ...doc });
  } catch (error) {
    if (isDuplicateKeyError(error)) return duplicateSlugState();
    return { message: "ذخیره ریزخدمت ناموفق بود." };
  }

  redirect(LIST_PATH);
}

export async function updateMicroService(
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
      .collection<MicroService>(COLLECTIONS.microServices)
      .updateOne({ _id: new ObjectId(id) }, { $set: doc });
  } catch (error) {
    if (isDuplicateKeyError(error)) return duplicateSlugState();
    return { message: "به‌روزرسانی ریزخدمت ناموفق بود." };
  }

  redirect(LIST_PATH);
}

export async function deleteMicroService(form: FormData) {
  await requireAdmin();

  const id = text(form, "id");
  if (!ObjectId.isValid(id)) redirect(LIST_PATH);

  const db = await getDb();
  if (db) {
    await db
      .collection<MicroService>(COLLECTIONS.microServices)
      .deleteOne({ _id: new ObjectId(id) });
  }

  redirect(LIST_PATH);
}
