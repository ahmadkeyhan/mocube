"use client";

import { useActionState } from "react";
import {
  Field,
  FormErrors,
  Select,
  TextArea,
  TextInput,
} from "@/components/admin/FormControls";
import { SubmitButton } from "@/components/admin/SubmitButton";
import type { FormState } from "@/lib/admin/validation";
import { updateBusinessProfile } from "@/lib/mocalendar/actions";
import { BUSINESS_FIELDS } from "@/lib/mocalendar/fields";
import type { Business, Serialized } from "@/lib/models/types";

type Props = {
  business: Serialized<Business>;
};

export function BusinessProfileForm({ business }: Props) {
  const [state, action] = useActionState(
    updateBusinessProfile,
    {} as FormState,
  );
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="flex flex-col gap-20">
      <FormErrors message={state.message} />
      <Field label="نام کسب‌وکار" htmlFor="name" error={errors.name}>
        <TextInput name="name" defaultValue={business.name} required />
      </Field>
      <Field label="حوزه" htmlFor="fieldSlug" error={errors.fieldSlug}>
        <Select
          name="fieldSlug"
          placeholder="انتخاب کنید"
          defaultValue={business.fieldSlug}
          options={BUSINESS_FIELDS.map((field) => ({
            value: field.slug,
            label: field.name,
          }))}
        />
      </Field>
      <Field
        label="زیرشاخه‌ها"
        htmlFor="subTags"
        hint="با ویرگول جدا کنید؛ مثلاً برگر، قهوهٔ تخصصی."
      >
        <TextInput name="subTags" defaultValue={business.subTags.join("، ")} />
      </Field>
      <Field label="شهر" htmlFor="city">
        <TextInput name="city" defaultValue={business.city} />
      </Field>
      <Field label="مخاطب" htmlFor="audience">
        <TextArea name="audience" defaultValue={business.audience} rows={3} />
      </Field>
      <Field label="لحن برند" htmlFor="tone">
        <TextInput name="tone" defaultValue={business.tone} />
      </Field>
      <Field label="اینستاگرام" htmlFor="instagram">
        <TextInput
          name="instagram"
          defaultValue={business.instagram}
          dir="ltr"
        />
      </Field>
      <Field
        label="رنگ‌های برند"
        htmlFor="brandColors"
        hint="کد رنگ با فاصله یا ویرگول؛ مثلاً #111111 #D1FFED"
      >
        <TextInput
          name="brandColors"
          defaultValue={business.brandColors.join(" ")}
          dir="ltr"
        />
      </Field>
      <SubmitButton>ذخیره پروفایل</SubmitButton>
    </form>
  );
}
