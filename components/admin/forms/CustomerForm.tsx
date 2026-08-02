"use client";

import { useActionState } from "react";
import {
  Field,
  FormErrors,
  TextArea,
  TextInput,
} from "@/components/admin/FormControls";
import { SubmitButton } from "@/components/admin/SubmitButton";
import type { FormState } from "@/lib/admin/validation";

type CustomerDefaults = {
  _id?: string;
  slug?: string;
  name?: string;
  logoUrl?: string;
  shortDescription?: string;
  description?: string;
};

type CustomerFormProps = {
  action: (
    state: FormState | undefined,
    formData: FormData,
  ) => Promise<FormState>;
  defaults?: CustomerDefaults;
};

export function CustomerForm({ action, defaults = {} }: CustomerFormProps) {
  const [state, formAction] = useActionState(action, {} as FormState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-20">
      <FormErrors message={state.message} />

      {defaults._id ? (
        <input type="hidden" name="id" value={defaults._id} />
      ) : null}

      <Field label="نام مشتری" htmlFor="name" error={errors.name}>
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

      <Field
        label="آدرس لوگو"
        htmlFor="logoUrl"
        hint="آدرس تصویر یا کد رنگ."
        error={errors.logoUrl}
      >
        <TextInput name="logoUrl" defaultValue={defaults.logoUrl} dir="ltr" />
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

      <SubmitButton>ذخیره</SubmitButton>
    </form>
  );
}
