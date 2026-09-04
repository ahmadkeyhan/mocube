"use client";

import { useActionState } from "react";
import { Field, FormErrors, TextInput } from "@/components/admin/FormControls";
import { SubmitButton } from "@/components/admin/SubmitButton";
import type { FormState } from "@/lib/admin/validation";
import {
  calendarLoginAction,
  calendarSignupAction,
} from "@/lib/mocalendar/actions";

export function CalendarLoginForm() {
  const [state, action] = useActionState(calendarLoginAction, {} as FormState);

  return (
    <form action={action} className="flex flex-col gap-20">
      <FormErrors message={state.message} />
      <Field label="نام کاربری" htmlFor="username">
        <TextInput name="username" dir="ltr" required />
      </Field>
      <Field label="رمز عبور" htmlFor="password">
        <TextInput name="password" type="password" dir="ltr" required />
      </Field>
      <SubmitButton pendingLabel="در حال ورود…">ورود</SubmitButton>
    </form>
  );
}

export function CalendarSignupForm() {
  const [state, action] = useActionState(calendarSignupAction, {} as FormState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="flex flex-col gap-20">
      <FormErrors message={state.message} />
      <Field label="نام کسب‌وکار" htmlFor="name" error={errors.name}>
        <TextInput name="name" required />
      </Field>
      <Field label="نام کاربری" htmlFor="username" error={errors.username}>
        <TextInput name="username" dir="ltr" required />
      </Field>
      <Field
        label="رمز عبور"
        htmlFor="password"
        hint="حداقل ۸ کاراکتر."
        error={errors.password}
      >
        <TextInput name="password" type="password" dir="ltr" required />
      </Field>
      <SubmitButton pendingLabel="در حال ثبت…">ثبت‌نام</SubmitButton>
    </form>
  );
}
