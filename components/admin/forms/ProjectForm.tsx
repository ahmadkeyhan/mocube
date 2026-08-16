"use client";

import { useActionState, useState } from "react";
import {
  CheckboxGroup,
  Field,
  FormErrors,
  type Option,
  Select,
  TextArea,
  TextInput,
  Toggle,
} from "@/components/admin/FormControls";
import {
  GalleriesEditor,
  type GalleryDefault,
} from "@/components/admin/GalleriesEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SubmitButton } from "@/components/admin/SubmitButton";
import type { FormState } from "@/lib/admin/validation";

type ProjectDefaults = {
  _id?: string;
  slug?: string;
  title?: string;
  coverUrl?: string;
  description?: string;
  customerId?: string;
  serviceIds?: string[];
  microServiceIds?: string[];
  featured?: boolean;
  galleries?: GalleryDefault[];
};

type ProjectFormProps = {
  action: (
    state: FormState | undefined,
    formData: FormData,
  ) => Promise<FormState>;
  customerOptions: Option[];
  serviceOptions: Option[];
  microServiceOptions: Option[];
  defaults?: ProjectDefaults;
};

export function ProjectForm({
  action,
  customerOptions,
  serviceOptions,
  microServiceOptions,
  defaults = {},
}: ProjectFormProps) {
  const [state, formAction] = useActionState(action, {} as FormState);
  const [coverUrl, setCoverUrl] = useState(defaults.coverUrl ?? "");
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-20">
      <FormErrors message={state.message} />

      {defaults._id ? (
        <input type="hidden" name="id" value={defaults._id} />
      ) : null}

      <Field label="عنوان پروژه" htmlFor="title" error={errors.title}>
        <TextInput name="title" defaultValue={defaults.title} required />
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

      <Field label="تصویر کاور" error={errors.coverUrl}>
        <ImageUploader
          name="coverUrl"
          value={coverUrl}
          onChange={setCoverUrl}
        />
      </Field>

      <Field label="مشتری" htmlFor="customerId" error={errors.customerId}>
        <Select
          name="customerId"
          options={customerOptions}
          defaultValue={defaults.customerId}
          placeholder="انتخاب مشتری"
        />
      </Field>

      <Field label="سرویس‌ها" error={errors.serviceIds}>
        <CheckboxGroup
          name="serviceIds"
          options={serviceOptions}
          defaultValues={defaults.serviceIds}
        />
      </Field>

      <Field label="ریزسرویس‌ها" error={errors.microServiceIds}>
        <CheckboxGroup
          name="microServiceIds"
          options={microServiceOptions}
          defaultValues={defaults.microServiceIds}
        />
      </Field>

      <Field label="توضیحات" htmlFor="description">
        <TextArea name="description" defaultValue={defaults.description} />
      </Field>

      <Toggle
        name="featured"
        label="نمایش در بخش شاخص"
        defaultChecked={defaults.featured}
      />

      <Field label="گالری‌ها">
        <GalleriesEditor
          microServiceOptions={microServiceOptions}
          defaultGalleries={defaults.galleries}
        />
      </Field>

      <SubmitButton>ذخیره</SubmitButton>
    </form>
  );
}
