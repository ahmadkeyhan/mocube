/** Jalali (Persian civil) calendar. Port of the jalaali-js / Borkowski algorithm. */

export type CivilDate = {
  year: number;
  month: number;
  day: number;
};

const JALALI_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
] as const;

const WEEKDAYS_SAT_FIRST = ["ش", "ی", "د", "س", "چ", "پ", "ج"] as const;

const BREAKS = [
  -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192,
  2262, 2324, 2394, 2456, 3178,
];

function div(a: number, b: number) {
  return ~~(a / b);
}

function mod(a: number, b: number) {
  return a - ~~(a / b) * b;
}

function jalCal(jy: number) {
  const bl = BREAKS.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = BREAKS[0];
  let jump = 0;

  if (jy < jp || jy >= BREAKS[bl - 1]) {
    throw new Error(`Jalali year ${jy} out of range`);
  }

  for (let i = 1; i < bl; i += 1) {
    const jm = BREAKS[i];
    jump = jm - jp;
    if (jy < jm) break;
    leapJ += div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }

  let n = jy - jp;
  leapJ += div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) leapJ += 1;

  const leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
  const march = 20 + leapJ - leapG;
  if (jump - n < 6) n = n - jump + div(jump + 4, 33) * 33;
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;

  return { leap, gy, march };
}

function g2d(gy: number, gm: number, gd: number) {
  let d =
    div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
    div(153 * mod(gm + 9, 12) + 2, 5) +
    gd -
    34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

function d2g(jdn: number): CivilDate {
  let j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  const i = div(mod(j, 1461), 4) * 5 + 308;
  return {
    year: div(j, 1461) - 100100 + div(8 - (mod(div(i, 153), 12) + 1), 6),
    month: mod(div(i, 153), 12) + 1,
    day: div(mod(i, 153), 5) + 1,
  };
}

function j2d(jy: number, jm: number, jd: number) {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

function d2j(jdn: number): CivilDate {
  const g = d2g(jdn);
  let jy = g.year - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(g.year, 3, r.march);
  let k = jdn - jdn1f;
  if (k >= 0) {
    if (k <= 185) {
      return { year: jy, month: 1 + div(k, 31), day: mod(k, 31) + 1 };
    }
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) k += 1;
  }
  return { year: jy, month: 7 + div(k, 30), day: mod(k, 30) + 1 };
}

export function isLeapJalaliYear(jy: number) {
  return jalCal(jy).leap === 0;
}

export function jalaliMonthLength(jy: number, jm: number) {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isLeapJalaliYear(jy) ? 30 : 29;
}

export function toJalali(date: Date): CivilDate {
  return d2j(
    g2d(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate()),
  );
}

export function toGregorian(jy: number, jm: number, jd: number): CivilDate {
  return d2g(j2d(jy, jm, jd));
}

export function jalaliToUtcDate(jy: number, jm: number, jd: number): Date {
  const g = toGregorian(jy, jm, jd);
  return new Date(Date.UTC(g.year, g.month - 1, g.day));
}

export function utcMidnight(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

export function utcDateKey(date: Date): string {
  return utcMidnight(date).toISOString().slice(0, 10);
}

export function parseUtcDateKey(key: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

export function jalaliMonthName(jm: number): string {
  return JALALI_MONTHS[jm - 1] ?? "";
}

export function jalaliWeekdayLabels(): readonly string[] {
  return WEEKDAYS_SAT_FIRST;
}

export type MonthCell = {
  key: string;
  date: Date;
  jalali: CivilDate;
  inMonth: boolean;
};

export function jalaliMonthGrid(jy: number, jm: number): MonthCell[] {
  const length = jalaliMonthLength(jy, jm);
  const first = jalaliToUtcDate(jy, jm, 1);
  const satIndex = (first.getUTCDay() + 1) % 7;
  const cells: MonthCell[] = [];

  for (let i = 0; i < satIndex; i += 1) {
    const date = new Date(first);
    date.setUTCDate(first.getUTCDate() - (satIndex - i));
    cells.push({
      key: utcDateKey(date),
      date,
      jalali: toJalali(date),
      inMonth: false,
    });
  }

  for (let day = 1; day <= length; day += 1) {
    const date = jalaliToUtcDate(jy, jm, day);
    cells.push({
      key: utcDateKey(date),
      date,
      jalali: { year: jy, month: jm, day },
      inMonth: true,
    });
  }

  while (cells.length < 42) {
    const last = cells[cells.length - 1].date;
    const date = new Date(last);
    date.setUTCDate(last.getUTCDate() + 1);
    cells.push({
      key: utcDateKey(date),
      date,
      jalali: toJalali(date),
      inMonth: false,
    });
  }

  return cells;
}

export function formatJalali(
  date: Date,
  digits: (value: string | number) => string,
) {
  const j = toJalali(date);
  return `${digits(j.day)} ${jalaliMonthName(j.month)} ${digits(j.year)}`;
}

export function todayJalali(): CivilDate {
  return toJalali(utcMidnight(new Date()));
}
