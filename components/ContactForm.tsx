"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  type FormEvent,
  type ReactNode,
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Field,
  FormErrors,
  TextArea,
  TextInput,
} from "@/components/admin/FormControls";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { submitInquiry } from "@/lib/actions/contact";
import type { FormState } from "@/lib/admin/validation";
import type { ServiceColor } from "@/lib/models/types";
import { toPersianDigits } from "@/lib/persian";
import { isValidPhone } from "@/lib/phone";
import {
  serviceBeforeColorClass,
  serviceBorderClass,
  serviceColorClass,
  serviceHoverBorderClass,
} from "@/lib/service-colors";

export type ContactServiceOption = {
  slug: string;
  name: string;
  color: ServiceColor;
  shortDescription: string;
  pricingPlans: {
    name: string;
    priceLabel: string;
    features: string[];
    highlighted: boolean;
  }[];
};

export type ContactMicroOption = {
  slug: string;
  name: string;
  shortDescription: string;
  serviceSlug: string;
};

type ContactFormProps = {
  services: ContactServiceOption[];
  microServices: ContactMicroOption[];
  initialServiceSlugs: string[];
  initialMicroSlugs: string[];
  initialPlan: { serviceSlug: string; planName: string } | null;
};

type ContactPath = "plans" | "micros" | "skip";

const STEP_COUNT = 4;
const STEP_LABELS = ["سرویس", "مسیر", "انتخاب", "شما"] as const;

const nextButtonClass =
  "inline-flex items-center justify-center rounded-full bg-shockingly-green px-24 py-12 text-body-sm font-bold text-background";

const backButtonClass =
  "inline-flex items-center justify-center rounded-full border border-background bg-off-background/50 px-20 py-12 text-body-sm font-bold text-foreground";

function initialPath(
  initialPlan: ContactFormProps["initialPlan"],
  initialMicroSlugs: string[],
): ContactPath | null {
  if (initialPlan) return "plans";
  if (initialMicroSlugs.length > 0) return "micros";
  return null;
}

function StepPanel({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();

  return (
    <div hidden={!active} {...(!active ? { inert: true } : {})}>
      <motion.div
        className="flex flex-col gap-20"
        initial={false}
        animate={
          reduce
            ? { opacity: 1, y: 0 }
            : { opacity: active ? 1 : 0, y: active ? 0 : 8 }
        }
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function ContactForm({
  services,
  microServices,
  initialServiceSlugs,
  initialMicroSlugs,
  initialPlan,
}: ContactFormProps) {
  const reduceMotion = useReducedMotion();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(submitInquiry, {} as FormState);
  const serverErrors = state.fieldErrors ?? {};
  const [step, setStep] = useState(() =>
    initialPlan || initialMicroSlugs.length > 0 ? 3 : 1,
  );
  const [path, setPath] = useState<ContactPath | null>(() =>
    initialPath(initialPlan, initialMicroSlugs),
  );
  const [stepError, setStepError] = useState("");
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const [selectedServices, setSelectedServices] = useState(
    () => new Set(initialServiceSlugs),
  );
  const [selectedMicros, setSelectedMicros] = useState(() =>
    initialPlan ? new Set<string>() : new Set(initialMicroSlugs),
  );
  const [plansByService, setPlansByService] = useState<Record<string, string>>(
    () =>
      initialPlan ? { [initialPlan.serviceSlug]: initialPlan.planName } : {},
  );

  const errors = { ...clientErrors, ...serverErrors };

  const selectedServiceList = useMemo(
    () => services.filter((service) => selectedServices.has(service.slug)),
    [selectedServices, services],
  );

  const microGroups = useMemo(() => {
    if (selectedServices.size === 0) return [];

    const byService = new Map<string, ContactMicroOption[]>();
    for (const micro of microServices) {
      if (!selectedServices.has(micro.serviceSlug)) continue;
      const list = byService.get(micro.serviceSlug) ?? [];
      list.push(micro);
      byService.set(micro.serviceSlug, list);
    }

    return selectedServiceList
      .filter((service) => byService.has(service.slug))
      .map((service) => ({
        service,
        micros: byService.get(service.slug) ?? [],
      }));
  }, [microServices, selectedServiceList, selectedServices]);

  function scrollToFormTop() {
    formRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  useEffect(() => {
    if (serverErrors.name || serverErrors.phone || serverErrors.businessName) {
      setStep(4);
      scrollToFormTop();
    } else if (state.message) {
      scrollToFormTop();
    }
  }, [
    reduceMotion,
    serverErrors.businessName,
    serverErrors.name,
    serverErrors.phone,
    state.message,
  ]);

  function clearCatalogForService(slug: string) {
    setSelectedMicros((prev) => {
      const next = new Set(prev);
      for (const micro of microServices) {
        if (micro.serviceSlug === slug) next.delete(micro.slug);
      }
      return next;
    });
    setPlansByService((prev) => {
      if (!(slug in prev)) return prev;
      const next = { ...prev };
      delete next[slug];
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
    if (!checked) clearCatalogForService(slug);
    setStepError("");
  }

  function choosePath(next: ContactPath) {
    setPath(next);
    setStepError("");
    if (next === "plans") setSelectedMicros(new Set());
    if (next === "micros") setPlansByService({});
    if (next === "skip") {
      setSelectedMicros(new Set());
      setPlansByService({});
    }
  }

  function goNext() {
    if (step === 1) {
      if (selectedServices.size === 0) {
        setStepError("حداقل یک سرویس را انتخاب کنید.");
        scrollToFormTop();
        return;
      }
      setStepError("");
      setStep(2);
      scrollToFormTop();
      return;
    }

    if (step === 2) {
      if (!path) {
        setStepError("یک مسیر را انتخاب کنید.");
        scrollToFormTop();
        return;
      }
      setStepError("");
      setStep(path === "skip" ? 4 : 3);
      scrollToFormTop();
      return;
    }

    if (step === 3) {
      if (path === "plans") {
        const missing = selectedServiceList.some(
          (service) => !plansByService[service.slug],
        );
        if (missing) {
          setStepError("برای هر سرویس یک پلن انتخاب کنید.");
          scrollToFormTop();
          return;
        }
      }
      if (path === "micros") {
        const missing = selectedServiceList.some((service) => {
          const available = microServices.filter(
            (micro) => micro.serviceSlug === service.slug,
          );
          if (available.length === 0) return false;
          return !available.some((micro) => selectedMicros.has(micro.slug));
        });
        if (missing) {
          setStepError("برای هر سرویس حداقل یک میکروسرویس انتخاب کنید.");
          scrollToFormTop();
          return;
        }
      }
      setStepError("");
      setStep(4);
      scrollToFormTop();
    }
  }

  function goBack() {
    setStepError("");
    if (step === 4 && path === "skip") {
      setStep(2);
      scrollToFormTop();
      return;
    }
    setStep((current) => Math.max(1, current - 1));
    scrollToFormTop();
  }

  function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    if (step !== 4) {
      event.preventDefault();
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const businessName = String(data.get("businessName") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const nextErrors: Record<string, string> = {};

    if (!name) nextErrors.name = "نام الزامی است.";
    if (!businessName) nextErrors.businessName = "نام کسب‌وکار الزامی است.";
    if (!phone) nextErrors.phone = "تلفن الزامی است.";
    else if (!isValidPhone(phone)) nextErrors.phone = "شماره تلفن معتبر نیست.";

    if (Object.keys(nextErrors).length > 0) {
      event.preventDefault();
      setClientErrors(nextErrors);
      scrollToFormTop();
    }
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={onFormSubmit}
      className="flex scroll-mt-80 flex-col gap-24"
    >
      {[...selectedServices].map((slug) => (
        <input key={slug} type="hidden" name="service" value={slug} />
      ))}
      {path === "plans"
        ? Object.entries(plansByService).map(([slug, planName]) => (
            <input
              key={`${slug}::${planName}`}
              type="hidden"
              name="plan"
              value={`${slug}::${planName}`}
            />
          ))
        : null}
      {path === "micros"
        ? [...selectedMicros].map((slug) => (
            <input key={slug} type="hidden" name="micro" value={slug} />
          ))
        : null}

      <div>
        <p className="text-caption text-surface-50">
          {toPersianDigits(step)} از {toPersianDigits(STEP_COUNT)} —{" "}
          {STEP_LABELS[step - 1]}
        </p>
        <div className="mt-8 flex gap-6">
          {STEP_LABELS.map((label, index) => {
            const n = index + 1;
            return (
              <span
                key={label}
                className={`h-1 flex-1 rounded-full ${
                  n <= step ? "bg-shockingly-green" : "bg-off-background"
                }`}
              />
            );
          })}
        </div>
      </div>

      

      <StepPanel active={step === 1}>
        <fieldset>
          <legend className="text-body-sm font-bold text-foreground">
            چه کمکی نیاز دارید؟
          </legend>
          <p className="mt-8 text-caption text-surface-50">
            یک یا چند سرویس را انتخاب کنید.
          </p>
          <div className="mt-16 grid gap-12 grid-cols-2">
            {services.map((service) => {
              const selected = selectedServices.has(service.slug);
              return (
                <label
                  key={service.slug}
                  className={`card-chrome cursor-pointer rounded-lg p-2 text-center transition-colors ${
                    selected
                      ? `${serviceBorderClass[service.color]} bg-off-background`
                      : `bg-background ${serviceHoverBorderClass[service.color]}`
                  }`}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selected}
                    onChange={(event) =>
                      toggleService(service.slug, event.target.checked)
                    }
                  />
                  <p
                    className="text-body tracking-subheading md:text-[26px]"
                  >
                    {service.name}
                  </p>
                </label>
              );
            })}
          </div>
        </fieldset>
      </StepPanel>

      <StepPanel active={step === 2}>
        <fieldset>
          <legend className="text-body-sm font-bold text-foreground">
            چطور ادامه بدهیم؟
          </legend>
          <p className="mt-8 text-caption text-surface-50">
            یک مسیر برای همه سرویس‌های انتخاب‌شده.
          </p>
          <div className="mt-16 grid gap-12">
            <PathCard
              selected={path === "plans"}
              title="پلن / بسته"
              hint="محدوده مشخص و قیمت تقریبی."
              onSelect={() => choosePath("plans")}
            />
            <PathCard
              selected={path === "micros"}
              title="میکروسرویس / بخش‌ها"
              hint="قطعات را خودتان بچینید. برای هر سرویس حداقل یکی."
              onSelect={() => choosePath("micros")}
            />
            <PathCard
              selected={path === "skip"}
              title="هنوز تصمیم نگرفتم"
              hint="فقط سرویس کافی است. جزئیات روی تماس."
              onSelect={() => choosePath("skip")}
            />
          </div>
        </fieldset>
      </StepPanel>

      <FormErrors message={state.message} />
      {stepError ? (
        <p className="rounded-lg border border-orangey bg-orangey/10 px-12 py-10 text-body-sm text-orangey">
          {stepError}
        </p>
      ) : null}

      <StepPanel active={step === 3}>
        {path === "plans" ? (
          <div className="flex flex-col gap-32">
            {selectedServiceList.map((service) => (
              <fieldset key={service.slug}>
                <legend className="text-body-sm font-bold text-foreground">
                  پلن {service.name}
                </legend>
                {service.pricingPlans.length === 0 ? (
                  <p className="mt-12 text-caption text-surface-50">
                    پلنی تعریف نشده.
                  </p>
                ) : (
                  <div className="mt-16 grid gap-12 md:grid-cols-2">
                    {service.pricingPlans.map((plan) => {
                      const selected =
                        plansByService[service.slug] === plan.name;
                      return (
                        <label
                          key={plan.name}
                          className={`card-chrome cursor-pointer rounded-lg p-24 transition-colors ${
                            selected
                              ? `${serviceBorderClass[service.color]} bg-off-background`
                              : `bg-background ${serviceHoverBorderClass[service.color]}`
                          }`}
                        >
                          <input
                            type="radio"
                            name={`plan-${service.slug}`}
                            className="sr-only"
                            checked={selected}
                            onChange={() => {
                              setPlansByService((prev) => ({
                                ...prev,
                                [service.slug]: plan.name,
                              }));
                              setStepError("");
                            }}
                          />
                          <p className="text-body-sm text-surface-50">
                            {plan.name}
                          </p>
                          <p className="font-changa mt-12 text-subheading font-bold tracking-subheading text-foreground">
                            {plan.priceLabel}
                          </p>
                          <ul className="mt-24 flex flex-col gap-12">
                            {plan.features.map((feature) => (
                              <li
                                key={feature}
                                className={`text-body-sm text-foreground before:me-8 ${serviceBeforeColorClass[service.color]} before:content-['•']`}
                              >
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </label>
                      );
                    })}
                  </div>
                )}
              </fieldset>
            ))}
          </div>
        ) : (
          <fieldset>
            <legend className="text-body-sm font-bold text-foreground">
              میکروسرویس‌ها
            </legend>
            <p className="mt-8 text-caption text-surface-50">
              برای هر سرویس حداقل یک بخش را انتخاب کنید.
            </p>
            {microGroups.length === 0 ? (
              <p className="mt-16 text-caption text-surface-50">
                میکروسرویسی برای این سرویس‌ها نیست.
              </p>
            ) : (
              <div className="mt-16 flex flex-col gap-24">
                {microGroups.map((group) => (
                  <div key={group.service.slug}>
                    {microGroups.length > 1 ? (
                      <p className="mb-12 text-caption text-surface-50">
                        {group.service.name}
                      </p>
                    ) : null}
                    <div className="grid gap-12">
                      {group.micros.map((micro) => {
                        const selected = selectedMicros.has(micro.slug);
                        return (
                          <label
                            key={micro.slug}
                            className={`card-chrome cursor-pointer rounded-lg p-24 transition-colors ${
                              selected
                                ? `${serviceBorderClass[group.service.color]} bg-off-background`
                                : `bg-background ${serviceHoverBorderClass[group.service.color]}`
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={selected}
                              onChange={(event) => {
                                const checked = event.target.checked;
                                setSelectedMicros((prev) => {
                                  const next = new Set(prev);
                                  if (checked) next.add(micro.slug);
                                  else next.delete(micro.slug);
                                  return next;
                                });
                              }}
                            />
                            <h3 className="text-[20px] leading-[1.2] font-bold tracking-[-0.2px] text-foreground md:text-[26px] md:tracking-[-0.26px]">
                              {micro.name}
                            </h3>
                            <p className="mt-12 text-body text-surface-50">
                              {micro.shortDescription}
                            </p>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </fieldset>
        )}
      </StepPanel>

      <StepPanel active={step === 4}>
        <div className="grid gap-20 md:grid-cols-2">
          <Field label="نام" htmlFor="name" error={errors.name}>
            <TextInput name="name" />
          </Field>
          <Field label="تلفن" htmlFor="phone" error={errors.phone}>
            <TextInput name="phone" type="tel" dir="ltr" />
          </Field>
        </div>
        <Field
          label="نام کسب‌وکار"
          htmlFor="businessName"
          error={errors.businessName}
        >
          <TextInput name="businessName" />
        </Field>
        <Field label="توضیح" htmlFor="message" hint="اختیاری">
          <TextArea name="message" rows={5} />
        </Field>
      </StepPanel>

      <div className="flex items-center justify-between gap-12">
        {step > 1 ? (
          <button type="button" className={backButtonClass} onClick={goBack}>
            قبلی
          </button>
        ) : (
          <span />
        )}
        {step < STEP_COUNT ? (
          <button type="button" className={nextButtonClass} onClick={goNext}>
            بعدی
          </button>
        ) : (
          <SubmitButton pendingLabel="در حال ارسال…">
            ارسال درخواست
          </SubmitButton>
        )}
      </div>
    </form>
  );
}

function PathCard({
  selected,
  title,
  hint,
  onSelect,
}: {
  selected: boolean;
  title: string;
  hint: string;
  onSelect: () => void;
}) {
  return (
    <label
      className={`card-chrome cursor-pointer rounded-lg p-24 transition-colors ${
        selected
          ? "border-shockingly-green bg-off-background"
          : "bg-background hover:border-surface-50"
      }`}
    >
      <input
        type="radio"
        name="contact-path"
        className="sr-only"
        checked={selected}
        onChange={onSelect}
      />
      <p className="text-body font-bold text-foreground">{title}</p>
      <p className="mt-8 text-body-sm text-surface-50">{hint}</p>
    </label>
  );
}
