"use client";

import { useActionState } from "react";
import {
  Field,
  FormErrors,
  TextArea,
  TextInput,
} from "@/components/admin/FormControls";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { updateSiteSettings } from "@/lib/admin/actions/settings";
import type { FormState } from "@/lib/admin/validation";

type SiteSettingsDefaults = {
  phone?: string;
  instagram?: string;
  telegram?: string;
  announcement?: string;
};

export function SiteSettingsForm({
  defaults = {},
}: {
  defaults?: SiteSettingsDefaults;
}) {
  const [state, formAction] = useActionState(
    updateSiteSettings,
    {} as FormState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-20">
      <FormErrors message={state.message} />

      <Field label="شماره تماس" htmlFor="phone">
        <TextInput name="phone" defaultValue={defaults.phone} dir="ltr" />
      </Field>

      <Field label="اینستاگرام" htmlFor="instagram" hint="بدون @">
        <TextInput
          name="instagram"
          defaultValue={defaults.instagram}
          dir="ltr"
        />
      </Field>

      <Field label="تلگرام" htmlFor="telegram" hint="بدون @">
        <TextInput name="telegram" defaultValue={defaults.telegram} dir="ltr" />
      </Field>

      <Field label="متن بنر اعلان" htmlFor="announcement">
        <TextArea
          name="announcement"
          defaultValue={defaults.announcement}
          rows={3}
        />
      </Field>

      <SubmitButton>ذخیره تنظیمات</SubmitButton>
    </form>
  );
}
