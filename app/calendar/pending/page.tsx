import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CALENDAR_HOME } from "@/auth";
import { requireBusinessAccount } from "@/lib/auth/guards";
import { calendarLogoutAction } from "@/lib/mocalendar/actions";
import { BUSINESS_STATUS_LABELS } from "@/lib/mocalendar/labels";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "در انتظار تأیید",
};

export default async function CalendarPendingPage() {
  const { business } = await requireBusinessAccount();
  if (business.status === "active") redirect(CALENDAR_HOME);

  const copy =
    business.status === "rejected"
      ? "درخواست شما رد شده است. برای پیگیری با استودیو تماس بگیرید."
      : "حساب شما ثبت شد. بعد از تأیید استودیو، تقویم محتوا در دسترس قرار می‌گیرد.";

  return (
    <main className="flex flex-1 items-center justify-center px-16 py-64">
      <div className="card-chrome w-full max-w-[480px] rounded-lg bg-off-background p-32">
        <p className="text-caption text-shockingly-green">موکلندر</p>
        <h1 className="mt-8 text-heading-sm tracking-heading-sm text-foreground">
          {BUSINESS_STATUS_LABELS[business.status]}
        </h1>
        <p className="mt-12 text-body text-surface-50">{copy}</p>
        <p className="mt-16 text-body-sm text-foreground">{business.name}</p>
        <form action={calendarLogoutAction} className="mt-24">
          <button
            type="submit"
            className="rounded-full bg-off-background px-20 py-10 text-body-sm text-foreground"
          >
            خروج
          </button>
        </form>
      </div>
    </main>
  );
}
