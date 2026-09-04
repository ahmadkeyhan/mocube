import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, CALENDAR_HOME } from "@/auth";
import { CalendarSignupForm } from "@/components/calendar/CalendarAuthForms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ثبت‌نام موکلندر",
};

export default async function CalendarSignupPage() {
  const session = await auth();
  if (session?.user?.role === "business") redirect(CALENDAR_HOME);
  if (session?.user?.role === "admin") redirect("/admin");

  return (
    <main className="flex flex-1 items-center justify-center px-16 py-64">
      <div className="card-chrome w-full max-w-[420px] rounded-lg bg-off-background p-32">
        <p className="text-caption text-shockingly-green">موکلندر</p>
        <h1 className="mt-8 text-heading-sm tracking-heading-sm text-foreground">
          ثبت کسب‌وکار
        </h1>
        <p className="mt-8 mb-24 text-body-sm text-surface-50">
          پس از ثبت، استودیو حساب را بررسی و فعال می‌کند.
        </p>
        <CalendarSignupForm />
        <p className="mt-20 text-body-sm text-surface-50">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link href="/calendar/login" className="text-shockingly-green">
            ورود
          </Link>
        </p>
      </div>
    </main>
  );
}
