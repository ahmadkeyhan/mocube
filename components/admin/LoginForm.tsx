"use client";

import { useActionState } from "react";
import { Field, FormErrors, TextInput } from "@/components/admin/FormControls";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { loginAction } from "@/lib/admin/actions/auth";
import type { FormState } from "@/lib/admin/validation";

const initialState: FormState = {};

export function LoginForm() {
  const [state, action] = useActionState(loginAction, initialState);

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
