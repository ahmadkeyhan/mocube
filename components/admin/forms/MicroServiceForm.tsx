"use client";

import { useActionState } from "react";
import {
  Field,
  FormErrors,
  type Option,
  Select,
  TextArea,
  TextInput,
} from "@/components/admin/FormControls";
import { SubmitButton } from "@/components/admin/SubmitButton";
import type { FormState } from "@/lib/admin/validation";

type MicroServiceDefaults = {
  _id?: string;
  slug?: string;
  name?: string;
  shortDescription?: string;
  description?: string;
  serviceId?: string;
  sortOrder?: number;
};

type MicroServiceFormProps = {
  action: (
    state: FormState | undefined,
    formData: FormData,
  ) => Promise<FormState>;
  serviceOptions: Option[];
  defaults?: MicroServiceDefaults;
};

export function MicroServiceForm({
  action,
  serviceOptions,
  defaults = {},
}: MicroServiceFormProps) {
  const [state, formAction] = useActionState(action, {} as FormState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-20">
      <FormErrors message={state.message} />

      {defaults._id ? (
        <input type="hidden" name="id" value={defaults._id} />
      ) : null}

      <Field label="نام ریزخدمت" htmlFor="name" error={errors.name}>
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

      <Field label="خدمت مرتبط" htmlFor="serviceId" error={errors.serviceId}>
        <Select
          name="serviceId"
          options={serviceOptions}
          defaultValue={defaults.serviceId}
          placeholder="انتخاب خدمت"
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

      <SubmitButton>ذخیره</SubmitButton>
    </form>
  );
}
