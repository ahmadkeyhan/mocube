import Link from "next/link";
import { CalendarNav } from "@/components/calendar/CalendarNav";
import { requireBusiness } from "@/lib/auth/guards";
import { calendarLogoutAction } from "@/lib/mocalendar/actions";

export const dynamic = "force-dynamic";

export default async function CalendarPanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user, business } = await requireBusiness();

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-24 px-16 py-24 lg:flex-row md:px-24">
      <aside className="flex shrink-0 flex-col gap-24 lg:w-[220px]">
        <div className="flex items-center justify-between gap-12">
          <Link
            href="/calendar"
            className="text-body-sm font-bold text-shockingly-green"
          >
            موکلندر
          </Link>
          <span className="text-caption text-surface-50">{user.name}</span>
        </div>
        <p className="text-caption text-surface-50">{business.name}</p>
        <CalendarNav />
        <form action={calendarLogoutAction} className="lg:mt-auto">
          <button
            type="submit"
            className="w-full rounded-full bg-off-background px-16 py-10 text-caption text-foreground"
          >
            خروج
          </button>
        </form>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
