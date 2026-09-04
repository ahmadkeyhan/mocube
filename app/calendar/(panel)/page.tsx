import type { Metadata } from "next";
import Link from "next/link";
import { surfaceCardClass } from "@/components/SurfaceCard";
import { requireBusiness } from "@/lib/auth/guards";
import {
  jalaliMonthGrid,
  jalaliMonthName,
  jalaliWeekdayLabels,
  todayJalali,
  utcDateKey,
} from "@/lib/jalali";
import { occasionsForField, occasionsOnDay } from "@/lib/mocalendar/calendars";
import { fieldName } from "@/lib/mocalendar/fields";
import { toPersianDigits } from "@/lib/persian";
import {
  getActiveOccasions,
  getEntriesInRange,
} from "@/lib/queries/mocalendar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "موکلندر",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CalendarMonthPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { business } = await requireBusiness();
  const params = await searchParams;
  const today = todayJalali();
  const y = Number(params.y) || today.year;
  const m = Number(params.m) || today.month;
  const month = Math.min(12, Math.max(1, m));

  const prev = month === 1 ? { y: y - 1, m: 12 } : { y, m: month - 1 };
  const next = month === 12 ? { y: y + 1, m: 1 } : { y, m: month + 1 };

  const cells = jalaliMonthGrid(y, month);
  const start = cells[0].date;
  const end = new Date(cells[cells.length - 1].date);
  end.setUTCDate(end.getUTCDate() + 1);

  const [occasions, entries] = await Promise.all([
    getActiveOccasions(),
    getEntriesInRange(business._id, start, end),
  ]);
  const relevant = occasionsForField(occasions, business.fieldSlug);
  const todayKey = utcDateKey(new Date());

  const entriesByDay = new Map<string, typeof entries>();
  for (const entry of entries) {
    const key = utcDateKey(new Date(entry.date));
    const list = entriesByDay.get(key) ?? [];
    list.push(entry);
    entriesByDay.set(key, list);
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    const week = cells.slice(i, i + 7);
    const empty = week
      .filter((cell) => cell.inMonth)
      .every((cell) => (entriesByDay.get(cell.key)?.length ?? 0) === 0);
    weeks.push({ week, empty });
  }

  return (
    <div className="flex flex-col gap-24">
      <div className="flex flex-wrap items-end justify-between gap-16">
        <div>
          <h1 className="text-heading-sm tracking-heading-sm text-foreground">
            {jalaliMonthName(month)} {toPersianDigits(y)}
          </h1>
          <p className="mt-8 text-body-sm text-surface-50">
            {business.fieldSlug
              ? `مناسبت‌های ${fieldName(business.fieldSlug)} و برنامهٔ خودتان`
              : "اول حوزه کسب‌وکار را در پروفایل مشخص کنید."}
          </p>
        </div>
        <div className="flex gap-8">
          <Link
            href={`/calendar?y=${prev.y}&m=${prev.m}`}
            className="rounded-full border border-surface-25 px-16 py-8 text-caption"
          >
            ماه قبل
          </Link>
          <Link
            href={`/calendar?y=${today.year}&m=${today.month}`}
            className="rounded-full border border-surface-25 px-16 py-8 text-caption"
          >
            امروز
          </Link>
          <Link
            href={`/calendar?y=${next.y}&m=${next.m}`}
            className="rounded-full border border-surface-25 px-16 py-8 text-caption"
          >
            ماه بعد
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-6 text-center text-caption text-surface-50">
        {jalaliWeekdayLabels().map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>

      <div className="flex flex-col gap-8">
        {weeks.map((row, index) => (
          <div key={row.week[0].key}>
            <div className="grid grid-cols-7 gap-6">
              {row.week.map((cell) => {
                const dayOccasions = cell.inMonth
                  ? occasionsOnDay(relevant, cell.date)
                  : [];
                const dayEntries = entriesByDay.get(cell.key) ?? [];
                const isToday = cell.key === todayKey;
                return (
                  <Link
                    key={cell.key}
                    href={`/calendar/day/${cell.key}`}
                    className={`${surfaceCardClass("panel")} min-h-108 p-12 ${
                      cell.inMonth ? "" : "opacity-40"
                    } ${isToday ? "border-shockingly-green" : ""}`}
                  >
                    <p className="text-body-sm font-bold text-foreground">
                      {toPersianDigits(cell.jalali.day)}
                    </p>
                    <p className="text-caption text-surface-50" dir="ltr">
                      {cell.date.getUTCDate()}/{cell.date.getUTCMonth() + 1}
                    </p>
                    <div className="mt-8 flex flex-col gap-4">
                      {dayOccasions.slice(0, 2).map((occasion) => (
                        <span
                          key={occasion.slug}
                          className="truncate text-caption text-shockingly-green"
                        >
                          {occasion.title}
                        </span>
                      ))}
                      {dayEntries.length > 0 ? (
                        <span className="text-caption text-surface-50">
                          {toPersianDigits(dayEntries.length)} برنامه
                        </span>
                      ) : null}
                    </div>
                  </Link>
                );
              })}
            </div>
            {row.empty ? (
              <p className="mt-6 text-caption text-lipstick-pink">
                هفته {toPersianDigits(index + 1)} خالی است — چیزی برنامه‌ریزی
                کنید.
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
