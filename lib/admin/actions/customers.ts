"use server";

import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import {
  duplicateSlugState,
  FieldErrors,
  type FormState,
  isDuplicateKeyError,
  requiredText,
  slug,
  text,
} from "@/lib/admin/validation";
import { requireAdmin } from "@/lib/auth/guards";
import { COLLECTIONS, getDb } from "@/lib/db";
import type { Customer } from "@/lib/models/types";

const LIST_PATH = "/admin/customers";

function parse(form: FormData) {
  const errors = new FieldErrors();

  const doc = {
    slug: slug(form, "slug", errors),
    name: requiredText(form, "name", errors, "نام مشتری"),
    logoUrl: text(form, "logoUrl"),
    shortDescription: text(form, "shortDescription"),
    description: text(form, "description"),
  };

  return { doc, errors };
}

export async function createCustomer(
  _prevState: FormState | undefined,
  form: FormData,
): Promise<FormState> {
  await requireAdmin();

  const { doc, errors } = parse(form);
  if (errors.hasAny) return errors.toState();

  const db = await getDb();
  if (!db) return { message: "اتصال به پایگاه داده برقرار نشد." };

  try {
    await db.collection<Customer>(COLLECTIONS.customers).insertOne({
      _id: new ObjectId(),
      ...doc,
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) return duplicateSlugState();
    return { message: "ذخیره مشتری ناموفق بود." };
  }

  redirect(LIST_PATH);
}

export async function updateCustomer(
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
      .collection<Customer>(COLLECTIONS.customers)
      .updateOne({ _id: new ObjectId(id) }, { $set: doc });
  } catch (error) {
    if (isDuplicateKeyError(error)) return duplicateSlugState();
    return { message: "به‌روزرسانی مشتری ناموفق بود." };
  }

  redirect(LIST_PATH);
}

export async function deleteCustomer(form: FormData) {
  await requireAdmin();

  const id = text(form, "id");
  if (!ObjectId.isValid(id)) redirect(LIST_PATH);

  const db = await getDb();
  if (db) {
    await db
      .collection<Customer>(COLLECTIONS.customers)
      .deleteOne({ _id: new ObjectId(id) });
  }

  redirect(LIST_PATH);
}
