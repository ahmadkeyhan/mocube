import type { Occasion, Serialized } from "@/lib/models/types";

type OccasionMatch =
  | Pick<Occasion, "date" | "active" | "fieldSlugs">
  | Serialized<Pick<Occasion, "date" | "active" | "fieldSlugs">>;

import {
  type CivilDate,
  jalaliToUtcDate,
  toJalali,
  utcMidnight,
} from "@/lib/jalali";

export function toHijri(date: Date): CivilDate {
  const parts = new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura", {
    timeZone: "UTC",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);
  const num = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);
  return { year: num("year"), month: num("month"), day: num("day") };
}

export function civilForCalendar(
  date: Date,
  calendar: Occasion["date"]["calendar"],
): CivilDate {
  if (calendar === "jalali") return toJalali(date);
  if (calendar === "hijri") return toHijri(date);
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

export function occasionMatchesDay(
  occasion: OccasionMatch,
  date: Date,
): boolean {
  const civil = civilForCalendar(date, occasion.date.calendar);
  if (occasion.date.month !== civil.month || occasion.date.day !== civil.day) {
    return false;
  }
  if (occasion.date.year != null && occasion.date.year !== civil.year) {
    return false;
  }
  return true;
}

export function occasionsOnDay<T extends OccasionMatch>(
  occasions: T[],
  date: Date,
): T[] {
  return occasions.filter((occasion) => occasionMatchesDay(occasion, date));
}

export function occasionsForField<T extends OccasionMatch>(
  occasions: T[],
  fieldSlug: string,
): T[] {
  return occasions.filter(
    (occasion) =>
      occasion.active &&
      (occasion.fieldSlugs.length === 0 ||
        occasion.fieldSlugs.includes(fieldSlug)),
  );
}

export function daysUntil(date: Date, from = utcMidnight(new Date())): number {
  const target = utcMidnight(date);
  return Math.round((target.getTime() - from.getTime()) / 86_400_000);
}

export function addUtcDays(date: Date, days: number): Date {
  const next = utcMidnight(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function isLateForLead(date: Date, leadTimeDays: number): boolean {
  return daysUntil(date) < leadTimeDays;
}

export function nextOccurrenceDate(
  occasion: OccasionMatch,
  after = utcMidnight(new Date()),
): Date | null {
  if (occasion.date.year != null) {
    if (occasion.date.calendar === "jalali") {
      return jalaliToUtcDate(
        occasion.date.year,
        occasion.date.month,
        occasion.date.day,
      );
    }
    if (occasion.date.calendar === "gregorian") {
      return new Date(
        Date.UTC(
          occasion.date.year,
          occasion.date.month - 1,
          occasion.date.day,
        ),
      );
    }
    return null;
  }

  for (let offset = 0; offset < 400; offset += 1) {
    const candidate = addUtcDays(after, offset);
    if (occasionMatchesDay(occasion, candidate)) return candidate;
  }
  return null;
}
