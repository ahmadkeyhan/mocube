import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, CALENDAR_HOME } from "@/auth";
import { CalendarLoginForm } from "@/components/calendar/CalendarAuthForms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ورود به موکلندر",
};

export default async function CalendarLoginPage() {
  const session = await auth();
  if (session?.user?.role === "business") redirect(CALENDAR_HOME);
  if (session?.user?.role === "admin") redirect("/admin");

  return (
    <main className="flex flex-1 items-center justify-center px-16 py-64">
      <div className="card-chrome w-full max-w-[420px] rounded-lg bg-off-background p-32">
        <p className="text-caption text-shockingly-green">موکلندر</p>
        <h1 className="mt-8 text-heading-sm tracking-heading-sm text-foreground">
          ورود کسب‌وکار
        </h1>
        <p className="mt-8 mb-24 text-body-sm text-surface-50">
          تقویم محتوا و مناسبت‌های مرتبط با حوزه شما.
        </p>
        <CalendarLoginForm />
        <p className="mt-20 text-body-sm text-surface-50">
          حساب ندارید؟{" "}
          <Link href="/calendar/signup" className="text-shockingly-green">
            ثبت‌نام
          </Link>
        </p>
      </div>
    </main>
  );
}
