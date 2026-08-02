"use server";

import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import {
  boolean,
  duplicateSlugState,
  FieldErrors,
  type FormState,
  integer,
  isDuplicateKeyError,
  objectId,
  objectIds,
  requiredText,
  slug,
  text,
} from "@/lib/admin/validation";
import { requireAdmin } from "@/lib/auth/guards";
import { COLLECTIONS, getDb } from "@/lib/db";
import type { Project, ProjectGallery } from "@/lib/models/types";

const LIST_PATH = "/admin/projects";

function parseGalleries(form: FormData): ProjectGallery[] {
  const count = integer(form, "gallery-count", 0);
  const galleries: ProjectGallery[] = [];

  for (let index = 0; index < count; index += 1) {
    const urls = text(form, `gallery-urls-${index}`)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const description = text(form, `gallery-description-${index}`);
    const microServiceIds = objectIds(form, `gallery-micro-${index}`);

    if (urls.length === 0 && !description && microServiceIds.length === 0) {
      continue;
    }

    galleries.push({
      urls,
      microServiceIds,
      ...(description ? { description } : {}),
    });
  }

  return galleries;
}

function parse(form: FormData) {
  const errors = new FieldErrors();
  const customerId = objectId(form, "customerId", errors, "مشتری");

  const doc = {
    slug: slug(form, "slug", errors),
    title: requiredText(form, "title", errors, "عنوان پروژه"),
    coverUrl: text(form, "coverUrl"),
    galleries: parseGalleries(form),
    customerId: customerId ?? new ObjectId(),
    serviceIds: objectIds(form, "serviceIds"),
    microServiceIds: objectIds(form, "microServiceIds"),
    featured: boolean(form, "featured"),
    description: text(form, "description"),
  };

  return { doc, errors };
}

export async function createProject(
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
      .collection<Project>(COLLECTIONS.projects)
      .insertOne({ _id: new ObjectId(), ...doc });
  } catch (error) {
    if (isDuplicateKeyError(error)) return duplicateSlugState();
    return { message: "ذخیره پروژه ناموفق بود." };
  }

  redirect(LIST_PATH);
}

export async function updateProject(
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
      .collection<Project>(COLLECTIONS.projects)
      .updateOne({ _id: new ObjectId(id) }, { $set: doc });
  } catch (error) {
    if (isDuplicateKeyError(error)) return duplicateSlugState();
    return { message: "به‌روزرسانی پروژه ناموفق بود." };
  }

  redirect(LIST_PATH);
}

export async function deleteProject(form: FormData) {
  await requireAdmin();

  const id = text(form, "id");
  if (!ObjectId.isValid(id)) redirect(LIST_PATH);

  const db = await getDb();
  if (db) {
    await db
      .collection<Project>(COLLECTIONS.projects)
      .deleteOne({ _id: new ObjectId(id) });
  }

  redirect(LIST_PATH);
}
