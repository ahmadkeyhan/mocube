import { NextResponse } from "next/server";
import { utcDateKey, utcMidnight } from "@/lib/jalali";
import { addUtcDays } from "@/lib/mocalendar/calendars";
import { KIND_LABELS } from "@/lib/mocalendar/labels";
import {
  getBusinessByShareToken,
  getEntriesInRange,
} from "@/lib/queries/mocalendar";

export const dynamic = "force-dynamic";

function icsEscape(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const business = await getBusinessByShareToken(token);
  if (!business) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const start = utcMidnight(new Date());
  start.setUTCDate(1);
  start.setUTCMonth(start.getUTCMonth() - 1);
  const end = addUtcDays(start, 400);
  const entries = await getEntriesInRange(business._id, start, end);

  const events = entries
    .filter((entry) => entry.status !== "skipped")
    .map((entry) => {
      const day = utcDateKey(new Date(entry.date)).replaceAll("-", "");
      const endDay = utcDateKey(addUtcDays(new Date(entry.date), 1)).replaceAll(
        "-",
        "",
      );
      return [
        "BEGIN:VEVENT",
        `UID:${entry._id}@mocalendar`,
        `DTSTART;VALUE=DATE:${day}`,
        `DTEND;VALUE=DATE:${endDay}`,
        `SUMMARY:${icsEscape(`${KIND_LABELS[entry.kind]}: ${entry.title}`)}`,
        entry.notes ? `DESCRIPTION:${icsEscape(entry.notes)}` : "",
        "END:VEVENT",
      ]
        .filter(Boolean)
        .join("\r\n");
    });

  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//moCube//MoCalendar//FA",
    `X-WR-CALNAME:${icsEscape(`موکلندر — ${business.name}`)}`,
    ...events,
    "END:VCALENDAR",
    "",
  ].join("\r\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="mocalendar.ics"`,
    },
  });
}
