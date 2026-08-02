"use client";

import { useActionState } from "react";
import {
  Field,
  FormErrors,
  Select,
  TextArea,
  TextInput,
} from "@/components/admin/FormControls";
import { PricingPlansEditor } from "@/components/admin/PricingPlansEditor";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { SERVICE_COLOR_LABELS, SERVICE_COLORS } from "@/lib/admin/constants";
import type { FormState } from "@/lib/admin/validation";
import type { PricingPlan, ServiceColor } from "@/lib/models/types";

type ServiceDefaults = {
  _id?: string;
  slug?: string;
  name?: string;
  color?: ServiceColor;
  shortDescription?: string;
  description?: string;
  sortOrder?: number;
  pricingPlans?: PricingPlan[];
};

type ServiceFormProps = {
  action: (
    state: FormState | undefined,
    formData: FormData,
  ) => Promise<FormState>;
  defaults?: ServiceDefaults;
};

const colorOptions = SERVICE_COLORS.map((color) => ({
  value: color,
  label: SERVICE_COLOR_LABELS[color],
}));

export function ServiceForm({ action, defaults = {} }: ServiceFormProps) {
  const [state, formAction] = useActionState(action, {} as FormState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-20">
      <FormErrors message={state.message} />

      {defaults._id ? (
        <input type="hidden" name="id" value={defaults._id} />
      ) : null}

      <Field label="نام خدمت" htmlFor="name" error={errors.name}>
        <TextInput name="name" defaultValue={defaults.name} required />
      </Field>

      <Field
        label="اسلاگ"
        htmlFor="slug"
        hint="فقط حروف کوچک انگلیسی، عدد و خط تیره."
        error={errors.slug}
      >
        <TextInput
          name="slug"
          defaultValue={defaults.slug}
          dir="ltr"
          required
        />
      </Field>

      <Field label="رنگ" htmlFor="color" error={errors.color}>
        <Select
          name="color"
          options={colorOptions}
          defaultValue={defaults.color}
          placeholder="انتخاب رنگ"
        />
      </Field>

      <Field label="توضیح کوتاه" htmlFor="shortDescription">
        <TextInput
          name="shortDescription"
          defaultValue={defaults.shortDescription}
        />
      </Field>

      <Field label="توضیح کامل" htmlFor="description">
        <TextArea name="description" defaultValue={defaults.description} />
      </Field>

      <Field label="ترتیب نمایش" htmlFor="sortOrder">
        <TextInput
          name="sortOrder"
          type="number"
          dir="ltr"
          defaultValue={String(defaults.sortOrder ?? 0)}
        />
      </Field>

      <Field label="پلن‌های قیمتی">
        <PricingPlansEditor defaultPlans={defaults.pricingPlans} />
      </Field>

      <SubmitButton>ذخیره</SubmitButton>
    </form>
  );
}
