"use server";

import { ObjectId } from "mongodb";
import { redirect } from "next/navigation";
import {
  FieldErrors,
  type FormState,
  requiredText,
  text,
} from "@/lib/admin/validation";
import { COLLECTIONS, getDb } from "@/lib/db";
import type {
  Inquiry,
  InquiryPlanSnapshot,
  MicroService,
  Service,
} from "@/lib/models/types";
import { isValidPhone } from "@/lib/phone";

function formList(form: FormData, name: string): string[] {
  return [
    ...new Set(
      form
        .getAll(name)
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  ];
}

function parsePlanValue(
  value: string,
): { serviceSlug: string; planName: string } | null {
  const separator = value.indexOf("::");
  if (separator <= 0) return null;
  const serviceSlug = value.slice(0, separator).trim();
  const planName = value.slice(separator + 2).trim();
  if (!serviceSlug || !planName) return null;
  return { serviceSlug, planName };
}

export async function submitInquiry(
  _prevState: FormState | undefined,
  form: FormData,
): Promise<FormState> {
  const errors = new FieldErrors();
  const name = requiredText(form, "name", errors, "نام");
  const businessName = requiredText(
    form,
    "businessName",
    errors,
    "نام کسب‌وکار",
  );
  const phone = requiredText(form, "phone", errors, "تلفن");
  const message = text(form, "message");

  if (phone && !isValidPhone(phone)) {
    errors.add("phone", "شماره تلفن معتبر نیست.");
  }

  if (errors.hasAny) return errors.toState();

  const db = await getDb();
  if (!db) return { message: "اتصال به پایگاه داده برقرار نشد." };

  const serviceSlugs = formList(form, "service");
  const microSlugs = formList(form, "micro");
  const planRefs = formList(form, "plan")
    .map(parsePlanValue)
    .filter((value): value is NonNullable<typeof value> => value !== null);

  const planSlugs = planRefs.map((ref) => ref.serviceSlug);
  const serviceQuerySlugs = [...new Set([...serviceSlugs, ...planSlugs])];

  const [serviceDocs, microDocs] = await Promise.all([
    serviceQuerySlugs.length > 0
      ? db
          .collection<Service>(COLLECTIONS.services)
          .find({ slug: { $in: serviceQuerySlugs } })
          .toArray()
      : Promise.resolve([]),
    microSlugs.length > 0
      ? db
          .collection<MicroService>(COLLECTIONS.microServices)
          .find({ slug: { $in: microSlugs } })
          .toArray()
      : Promise.resolve([]),
  ]);

  const serviceBySlug = new Map(serviceDocs.map((s) => [s.slug, s]));

  const services = serviceDocs.map((s) => ({ slug: s.slug, name: s.name }));
  const microServices = microDocs.map((m) => ({ slug: m.slug, name: m.name }));

  const planSnapshots: InquiryPlanSnapshot[] = [];
  for (const ref of planRefs) {
    const planService = serviceBySlug.get(ref.serviceSlug);
    const matchedPlan = planService?.pricingPlans.find(
      (p) => p.name === ref.planName,
    );
    if (!planService || !matchedPlan) continue;
    planSnapshots.push({
      serviceSlug: planService.slug,
      serviceName: planService.name,
      planName: matchedPlan.name,
      priceLabel: matchedPlan.priceLabel,
    });
  }

  const plan = planSnapshots[0] ?? null;

  try {
    await db.collection<Inquiry>(COLLECTIONS.inquiries).insertOne({
      _id: new ObjectId(),
      name,
      phone,
      businessName,
      message,
      services,
      microServices,
      plan,
      createdAt: new Date(),
      read: false,
    });
  } catch {
    return { message: "ارسال فرم ناموفق بود. دوباره تلاش کنید." };
  }

  redirect("/contact?sent=1");
}
