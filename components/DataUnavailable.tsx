"use client";

import { useRouter } from "next/navigation";

type DataUnavailableProps = {
  message: string;
  className?: string;
};

export function DataUnavailable({
  message,
  className = "",
}: DataUnavailableProps) {
  const router = useRouter();

  return (
    <div
      className={`col-span-2 flex flex-col items-center gap-24 py-76 text-center ${className}`}
    >
      <p className="max-w-md text-body text-surface-50">{message}</p>
      <button
        type="button"
        onClick={() => router.refresh()}
        className="inline-flex items-center justify-center rounded-full border border-foreground px-20 py-12 text-body-sm font-bold text-foreground transition-colors hover:border-surface-50 hover:text-foreground"
      >
        تلاش مجدد
      </button>
    </div>
  );
}
