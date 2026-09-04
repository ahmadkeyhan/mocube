import type {
  BriefStatus,
  BusinessStatus,
  CalendarEntryKind,
  CalendarEntryStatus,
  OccasionCalendar,
  OccasionKind,
  OccasionScope,
} from "@/lib/models/types";

export const KIND_LABELS: Record<CalendarEntryKind, string> = {
  post: "پست",
  story: "استوری",
  reel: "ریل",
  campaign: "کمپین",
  poster: "پوستر",
  note: "یادداشت",
};

export const ENTRY_STATUS_LABELS: Record<CalendarEntryStatus, string> = {
  planned: "برنامه‌ریزی‌شده",
  ready: "آماده",
  published: "منتشرشده",
  skipped: "رد شده",
};

export const BRIEF_STATUS_LABELS: Record<BriefStatus, string> = {
  requested: "درخواست‌شده",
  inDesign: "در حال طراحی",
  delivered: "تحویل‌شده",
  cancelled: "لغو",
};

export const BUSINESS_STATUS_LABELS: Record<BusinessStatus, string> = {
  pending: "در انتظار تأیید",
  active: "فعال",
  rejected: "رد شده",
};

export const SCOPE_LABELS: Record<OccasionScope, string> = {
  global: "جهانی",
  national: "ملی",
};

export const CALENDAR_LABELS: Record<OccasionCalendar, string> = {
  jalali: "شمسی",
  gregorian: "میلادی",
  hijri: "قمری",
};

export const SUGGESTED_KIND_LABELS: Record<OccasionKind, string> = {
  campaign: "کمپین",
  poster: "پوستر",
};

export const OWN_CONTENT_KINDS: CalendarEntryKind[] = [
  "post",
  "story",
  "reel",
  "note",
];
