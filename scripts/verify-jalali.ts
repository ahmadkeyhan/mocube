import { jalaliMonthLength, jalaliToUtcDate, toJalali } from "../lib/jalali";

function icuJalali(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US-u-ca-persian", {
    timeZone: "UTC",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);
  const num = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value);
  return { year: num("year"), month: num("month"), day: num("day") };
}

function run() {
  let mismatches = 0;
  let checked = 0;

  for (let jy = 1300; jy <= 1450; jy += 1) {
    for (let jm = 1; jm <= 12; jm += 1) {
      const length = jalaliMonthLength(jy, jm);
      for (let jd = 1; jd <= length; jd += 1) {
        let date: Date;
        try {
          date = jalaliToUtcDate(jy, jm, jd);
        } catch {
          continue;
        }
        const back = toJalali(date);
        if (back.month !== jm) continue;
        if (back.day !== jd || back.year !== jy) {
          mismatches += 1;
          console.error("roundtrip fail", { jy, jm, jd, back });
          continue;
        }
        const icu = icuJalali(date);
        checked += 1;
        if (icu.year !== jy || icu.month !== jm || icu.day !== jd) {
          mismatches += 1;
          console.error("icu mismatch", {
            jy,
            jm,
            jd,
            icu,
            iso: date.toISOString(),
          });
        }
      }
    }
  }

  if (mismatches > 0) {
    console.error(`Failed: ${mismatches} mismatches after ${checked} days.`);
    process.exit(1);
  }
  console.log(`OK: ${checked} days 1300–1450 match ICU Persian calendar.`);
}

run();
