"use client";

import { useActionState } from "react";
import {
  CheckboxGroup,
  Field,
  FormErrors,
  Select,
  TextArea,
  TextInput,
  Toggle,
} from "@/components/admin/FormControls";
import { SubmitButton } from "@/components/admin/SubmitButton";
import type { FormState } from "@/lib/admin/validation";
import { BUSINESS_FIELDS } from "@/lib/mocalendar/fields";
import type { Occasion, Serialized } from "@/lib/models/types";

type Props = {
  action: (state: FormState | undefined, form: FormData) => Promise<FormState>;
  defaults?: Serialized<Occasion>;
};

export function OccasionForm({ action, defaults }: Props) {
  const [state, formAction] = useActionState(action, {} as FormState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-20">
      <FormErrors message={state.message} />
      {defaults?._id ? (
        <input type="hidden" name="id" value={defaults._id} />
      ) : null}

      <Field label="عنوان" htmlFor="title" error={errors.title}>
        <TextInput name="title" defaultValue={defaults?.title} required />
      </Field>
      <Field label="اسلاگ" htmlFor="slug" error={errors.slug}>
        <TextInput
          name="slug"
          defaultValue={defaults?.slug}
          dir="ltr"
          required
        />
      </Field>
      <Field label="توضیح" htmlFor="description">
        <TextArea name="description" defaultValue={defaults?.description} />
      </Field>
      <div className="grid gap-20 md:grid-cols-2">
        <Field label="محدوده" htmlFor="scope" error={errors.scope}>
          <Select
            name="scope"
            defaultValue={defaults?.scope ?? "national"}
            options={[
              { value: "national", label: "ملی" },
              { value: "global", label: "جهانی" },
            ]}
          />
        </Field>
        <Field
          label="نوع پیشنهادی"
          htmlFor="suggestedKind"
          error={errors.suggestedKind}
        >
          <Select
            name="suggestedKind"
            defaultValue={defaults?.suggestedKind ?? "poster"}
            options={[
              { value: "poster", label: "پوستر" },
              { value: "campaign", label: "کمپین" },
            ]}
          />
        </Field>
      </div>
      <div className="grid gap-20 md:grid-cols-4">
        <Field label="تقویم" htmlFor="calendar" error={errors.calendar}>
          <Select
            name="calendar"
            defaultValue={defaults?.date.calendar ?? "jalali"}
            options={[
              { value: "jalali", label: "شمسی" },
              { value: "gregorian", label: "میلادی" },
              { value: "hijri", label: "قمری" },
            ]}
          />
        </Field>
        <Field
          label="سال"
          htmlFor="year"
          hint="خالی = هر سال"
          error={errors.year}
        >
          <TextInput
            name="year"
            type="number"
            defaultValue={
              defaults?.date.year != null ? String(defaults.date.year) : ""
            }
            dir="ltr"
          />
        </Field>
        <Field label="ماه" htmlFor="month" error={errors.month}>
          <TextInput
            name="month"
            type="number"
            defaultValue={defaults ? String(defaults.date.month) : ""}
            dir="ltr"
            required
          />
        </Field>
        <Field label="روز" htmlFor="day" error={errors.day}>
          <TextInput
            name="day"
            type="number"
            defaultValue={defaults ? String(defaults.date.day) : ""}
            dir="ltr"
            required
          />
        </Field>
      </div>
      <div className="grid gap-20 md:grid-cols-2">
        <Field label="مهلت طراحی (روز قبل)" htmlFor="leadTimeDays">
          <TextInput
            name="leadTimeDays"
            type="number"
            defaultValue={String(defaults?.leadTimeDays ?? 7)}
            dir="ltr"
          />
        </Field>
        <Field label="اهمیت ۱–۳" htmlFor="importance" error={errors.importance}>
          <TextInput
            name="importance"
            type="number"
            defaultValue={String(defaults?.importance ?? 2)}
            dir="ltr"
          />
        </Field>
      </div>
      <Field
        label="حوزه‌ها"
        hint="خالی = برای همه. انتخاب یعنی فقط همان حوزه‌ها."
      >
        <CheckboxGroup
          name="fieldSlugs"
          options={BUSINESS_FIELDS.map((field) => ({
            value: field.slug,
            label: field.name,
          }))}
          defaultValues={defaults?.fieldSlugs}
        />
      </Field>
      <Toggle
        name="active"
        label="فعال"
        defaultChecked={defaults?.active ?? true}
      />
      <SubmitButton>ذخیره مناسبت</SubmitButton>
    </form>
  );
}
