import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { surfaceCardClass } from "@/components/SurfaceCard";
import {
  jalaliMonthGrid,
  jalaliMonthName,
  jalaliWeekdayLabels,
  todayJalali,
  utcDateKey,
} from "@/lib/jalali";
import { occasionsForField, occasionsOnDay } from "@/lib/mocalendar/calendars";
import { toPersianDigits } from "@/lib/persian";
import {
  getActiveOccasions,
  getBusinessByShareToken,
  getEntriesInRange,
} from "@/lib/queries/mocalendar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "تقویم اشتراکی",
};

type PageProps = {
  params: Promise<{ token: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SharedCalendarPage({
  params,
  searchParams,
}: PageProps) {
  const { token } = await params;
  const business = await getBusinessByShareToken(token);
  if (!business) notFound();

  const query = await searchParams;
  const today = todayJalali();
  const y = Number(query.y) || today.year;
  const m = Number(query.m) || today.month;
  const month = Math.min(12, Math.max(1, m));
  const cells = jalaliMonthGrid(y, month);
  const start = cells[0].date;
  const end = new Date(cells[cells.length - 1].date);
  end.setUTCDate(end.getUTCDate() + 1);

  const [occasions, entries] = await Promise.all([
    getActiveOccasions(),
    getEntriesInRange(business._id, start, end),
  ]);
  const relevant = occasionsForField(occasions, business.fieldSlug);
  const entriesByDay = new Map<string, number>();
  for (const entry of entries) {
    const key = utcDateKey(new Date(entry.date));
    entriesByDay.set(key, (entriesByDay.get(key) ?? 0) + 1);
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] px-16 py-40 md:px-24">
      <p className="text-caption text-shockingly-green">موکلندر · فقط مشاهده</p>
      <h1 className="mt-8 text-heading-sm tracking-heading-sm text-foreground">
        {business.name}
      </h1>
      <p className="mt-8 text-body-sm text-surface-50">
        {jalaliMonthName(month)} {toPersianDigits(y)}
      </p>
      <div className="mt-24 grid grid-cols-7 gap-6 text-center text-caption text-surface-50">
        {jalaliWeekdayLabels().map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-7 gap-6">
        {cells.map((cell) => {
          const dayOccasions = cell.inMonth
            ? occasionsOnDay(relevant, cell.date)
            : [];
          return (
            <div
              key={cell.key}
              className={`${surfaceCardClass("panel")} min-h-96 p-12 ${
                cell.inMonth ? "" : "opacity-40"
              }`}
            >
              <p className="text-body-sm font-bold">
                {toPersianDigits(cell.jalali.day)}
              </p>
              {dayOccasions.slice(0, 2).map((occasion) => (
                <p
                  key={occasion.slug}
                  className="mt-4 truncate text-caption text-shockingly-green"
                >
                  {occasion.title}
                </p>
              ))}
              {(entriesByDay.get(cell.key) ?? 0) > 0 ? (
                <p className="mt-4 text-caption text-surface-50">
                  {toPersianDigits(entriesByDay.get(cell.key) ?? 0)} برنامه
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </main>
  );
}
