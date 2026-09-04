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
import {
  createOwnEntry,
  generateEntryIdeas,
  requestBrief,
  updateOwnEntry,
} from "@/lib/mocalendar/actions";
import { KIND_LABELS, OWN_CONTENT_KINDS } from "@/lib/mocalendar/labels";
import type { CalendarEntry, Serialized } from "@/lib/models/types";

const kindOptions = OWN_CONTENT_KINDS.map((kind) => ({
  value: kind,
  label: KIND_LABELS[kind],
}));

export function OwnEntryForm({
  dateKey,
  entry,
}: {
  dateKey: string;
  entry?: Serialized<CalendarEntry>;
}) {
  const action = entry ? updateOwnEntry : createOwnEntry;
  const [state, formAction] = useActionState(action, {} as FormState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-16">
      <FormErrors message={state.message} />
      <input type="hidden" name="date" value={dateKey} />
      {entry ? <input type="hidden" name="id" value={entry._id} /> : null}
      <Field
        label="عنوان"
        htmlFor={entry ? "title-edit" : "title"}
        error={errors.title}
      >
        <TextInput name="title" defaultValue={entry?.title} required />
      </Field>
      <Field label="نوع" htmlFor="kind" error={errors.kind}>
        <Select
          name="kind"
          defaultValue={entry?.kind ?? "post"}
          options={kindOptions}
        />
      </Field>
      {entry ? (
        <Field label="وضعیت" htmlFor="status">
          <Select
            name="status"
            defaultValue={entry.status}
            options={[
              { value: "planned", label: "برنامه‌ریزی‌شده" },
              { value: "ready", label: "آماده" },
              { value: "published", label: "منتشرشده" },
              { value: "skipped", label: "رد شده" },
            ]}
          />
        </Field>
      ) : null}
      <Field label="یادداشت" htmlFor="notes">
        <TextArea name="notes" defaultValue={entry?.notes} rows={3} />
      </Field>
      <SubmitButton>{entry ? "به‌روزرسانی" : "افزودن محتوا"}</SubmitButton>
    </form>
  );
}

export function GenerateIdeasForm({
  entryId,
  dateKey,
}: {
  entryId: string;
  dateKey: string;
}) {
  const [state, action] = useActionState(generateEntryIdeas, {} as FormState);

  return (
    <form action={action} className="flex flex-col gap-12">
      <FormErrors message={state.message} />
      <input type="hidden" name="id" value={entryId} />
      <input type="hidden" name="date" value={dateKey} />
      <Field label="بازخورد برای بازتولید" htmlFor="feedback" hint="اختیاری">
        <TextInput name="feedback" />
      </Field>
      <SubmitButton pendingLabel="در حال فکر کردن…">
        تولید ایده با هوش مصنوعی
      </SubmitButton>
    </form>
  );
}

export function RequestBriefButton({
  entryId,
  dateKey,
  ideaIndex,
  late,
}: {
  entryId: string;
  dateKey: string;
  ideaIndex: number;
  late: boolean;
}) {
  const [state, action] = useActionState(requestBrief, {} as FormState);

  return (
    <form action={action}>
      <FormErrors message={state.message} />
      <input type="hidden" name="id" value={entryId} />
      <input type="hidden" name="date" value={dateKey} />
      <input type="hidden" name="ideaIndex" value={String(ideaIndex)} />
      <SubmitButton pendingLabel="در حال ارسال…">
        {late ? "ارسال درخواست (دیر است)" : "تأیید ایده و سفارش طراحی"}
      </SubmitButton>
    </form>
  );
}
