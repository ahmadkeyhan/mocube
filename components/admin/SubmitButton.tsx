"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel?: string;
};

export function SubmitButton({
  children,
  pendingLabel = "در حال ذخیره…",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-shockingly-green px-24 py-12 text-body-sm font-bold text-background transition-opacity disabled:opacity-60"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
