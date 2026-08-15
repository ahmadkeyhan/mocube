"use client";

import { useActionState, useMemo, useState } from "react";
import {
  Field,
  FormErrors,
  TextArea,
  TextInput,
} from "@/components/admin/FormControls";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { submitInquiry } from "@/lib/actions/contact";
import type { FormState } from "@/lib/admin/validation";

export type ContactServiceOption = {
  slug: string;
  name: string;
  pricingPlans: { name: string; priceLabel: string }[];
};

export type ContactMicroOption = {
  slug: string;
  name: string;
  serviceSlug: string;
};

type ContactFormProps = {
  services: ContactServiceOption[];
  microServices: ContactMicroOption[];
  initialServiceSlugs: string[];
  initialMicroSlugs: string[];
  initialPlan: { serviceSlug: string; planName: string } | null;
};

const chipClass =
  "flex cursor-pointer items-center gap-6 rounded-full border border-surface-25 px-12 py-6 text-caption text-foreground has-[:checked]:border-shockingly-green has-[:checked]:text-shockingly-green";

const selectClass =
  "w-full rounded-lg border border-surface-25 bg-off-background px-12 py-10 text-body-sm text-foreground outline-none transition-colors focus:border-shockingly-green";

export function ContactForm({
  services,
  microServices,
  initialServiceSlugs,
  initialMicroSlugs,
  initialPlan,
}: ContactFormProps) {
  const [state, formAction] = useActionState(submitInquiry, {} as FormState);
  const errors = state.fieldErrors ?? {};
  const cameFromPlan = Boolean(initialPlan);
  const planServiceSlug = initialPlan?.serviceSlug ?? "";

  const [selectedServices, setSelectedServices] = useState(
    () => new Set(initialServiceSlugs),
  );
  const [selectedMicros, setSelectedMicros] = useState(() => {
    const next = new Set(initialMicroSlugs);
    if (initialPlan) {
      for (const micro of microServices) {
        if (micro.serviceSlug === initialPlan.serviceSlug) next.delete(micro.slug);
      }
    }
    return next;
  });
  const [planValue, setPlanValue] = useState(() =>
    initialPlan ? `${initialPlan.serviceSlug}::${initialPlan.planName}` : "",
  );

  const planService = services.find((service) => service.slug === planServiceSlug);
  const activePlanServiceSlug = planValue.includes("::")
    ? planValue.slice(0, planValue.indexOf("::"))
    : "";

  const showPlan =
    cameFromPlan && Boolean(planService) && selectedServices.has(planServiceSlug);

  const microGroups = useMemo(() => {
    if (selectedServices.size === 0) return [];

    const byService = new Map<string, ContactMicroOption[]>();
    for (const micro of microServices) {
      if (!selectedServices.has(micro.serviceSlug)) continue;
      if (micro.serviceSlug === activePlanServiceSlug) continue;
      const list = byService.get(micro.serviceSlug) ?? [];
      list.push(micro);
      byService.set(micro.serviceSlug, list);
    }

    return services
      .filter((service) => byService.has(service.slug))
      .map((service) => ({
        service,
        micros: byService.get(service.slug) ?? [],
      }));
  }, [activePlanServiceSlug, microServices, selectedServices, services]);

  function clearMicrosForService(slug: string) {
    setSelectedMicros((prev) => {
      const next = new Set(prev);
      for (const micro of microServices) {
        if (micro.serviceSlug === slug) next.delete(micro.slug);
      }
      return next;
    });
  }

  function toggleService(slug: string, checked: boolean) {
    setSelectedServices((prev) => {
      const next = new Set(prev);
      if (checked) next.add(slug);
      else next.delete(slug);
      return next;
    });
    if (!checked) {
      clearMicrosForService(slug);
      if (slug === planServiceSlug) setPlanValue("");
    }
  }

  function toggleMicro(slug: string, serviceSlug: string, checked: boolean) {
    setSelectedMicros((prev) => {
      const next = new Set(prev);
      if (checked) next.add(slug);
      else next.delete(slug);
      return next;
    });
    if (checked) {
      setSelectedServices((prev) => {
        if (prev.has(serviceSlug)) return prev;
        const next = new Set(prev);
        next.add(serviceSlug);
        return next;
      });
    }
  }

  function onPlanChange(value: string) {
    setPlanValue(value);
    if (value) {
      const slug = value.slice(0, value.indexOf("::"));
      setSelectedServices((prev) => {
        if (prev.has(slug)) return prev;
        const next = new Set(prev);
        next.add(slug);
        return next;
      });
      clearMicrosForService(slug);
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-20">
      <FormErrors message={state.message} />

      <div className="grid gap-20 md:grid-cols-2">
        <Field label="نام" htmlFor="name" error={errors.name}>
          <TextInput name="name" required />
        </Field>
        <Field label="تلفن" htmlFor="phone" error={errors.phone}>
          <TextInput name="phone" type="tel" dir="ltr" required />
        </Field>
      </div>

      <Field
        label="نام کسب‌وکار"
        htmlFor="businessName"
        error={errors.businessName}
      >
        <TextInput name="businessName" required />
      </Field>

      <Field
        label="چه کمکی نیاز دارید؟"
        htmlFor="service"
        hint="اگر هنوز جزئیات مشخص نیست، فقط خدمت را انتخاب کنید."
      >
        <div className="flex flex-wrap gap-8 rounded-lg py-2">
          {services.map((service) => (
            <label key={service.slug} className={chipClass}>
              <input
                type="checkbox"
                name="service"
                value={service.slug}
                checked={selectedServices.has(service.slug)}
                onChange={(event) =>
                  toggleService(service.slug, event.target.checked)
                }
                className="size-12 accent-shockingly-green"
              />
              {service.name}
            </label>
          ))}
        </div>
      </Field>

      {showPlan && planService ? (
        <Field
          label="پلن انتخاب‌شده"
          htmlFor="plan"
          hint="از کارت قیمت آمده‌اید. می‌توانید پلن را عوض کنید یا بردارید."
        >
          <select
            id="plan"
            name="plan"
            value={planValue}
            onChange={(event) => onPlanChange(event.target.value)}
            className={selectClass}
          >
            <option value="">بدون پلن — بعداً تصمیم می‌گیرم</option>
            {planService.pricingPlans.map((plan) => (
              <option
                key={`${planService.slug}::${plan.name}`}
                value={`${planService.slug}::${plan.name}`}
              >
                {planService.name} / {plan.name} — {plan.priceLabel}
              </option>
            ))}
          </select>
        </Field>
      ) : null}

      {microGroups.length > 0 ? (
        <Field
          label="جزئیات اختیاری"
          htmlFor="micro"
          hint="اگر می‌دانید کدام بخش را می‌خواهید انتخاب کنید؛ وگرنه خالی بگذارید."
        >
          <div className="card-chrome flex flex-col gap-16 rounded-lg p-12">
            {microGroups.map((group) => (
              <div key={group.service.slug}>
                {microGroups.length > 1 ? (
                  <p className="mb-8 text-caption text-surface-50">
                    {group.service.name}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-8">
                  {group.micros.map((micro) => (
                    <label key={micro.slug} className={chipClass}>
                      <input
                        type="checkbox"
                        name="micro"
                        value={micro.slug}
                        checked={selectedMicros.has(micro.slug)}
                        onChange={(event) =>
                          toggleMicro(
                            micro.slug,
                            micro.serviceSlug,
                            event.target.checked,
                          )
                        }
                        className="size-12 accent-shockingly-green"
                      />
                      {micro.name}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Field>
      ) : null}

      <Field label="توضیح" htmlFor="message" hint="اختیاری">
        <TextArea name="message" rows={5} />
      </Field>

      <SubmitButton pendingLabel="در حال ارسال…">ارسال درخواست</SubmitButton>
    </form>
  );
}
