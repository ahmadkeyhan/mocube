import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SurfaceCard } from "@/components/SurfaceCard";
import { setBriefStatus } from "@/lib/admin/actions/mocalendar";
import { requireAdmin } from "@/lib/auth/guards";
import { formatJalali } from "@/lib/jalali";
import { BRIEF_STATUS_LABELS, KIND_LABELS } from "@/lib/mocalendar/labels";
import { toPersianDigits } from "@/lib/persian";
import { getBriefs } from "@/lib/queries/mocalendar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "سفارش‌های طراحی",
};

const NEXT: Record<string, { status: string; label: string }[]> = {
  requested: [
    { status: "inDesign", label: "شروع طراحی" },
    { status: "cancelled", label: "لغو" },
  ],
  inDesign: [
    { status: "delivered", label: "تحویل" },
    { status: "cancelled", label: "لغو" },
  ],
};

export default async function AdminBriefsPage() {
  await requireAdmin();
  const briefs = await getBriefs();

  return (
    <div className="flex flex-col gap-24">
      <AdminPageHeader
        title="سفارش‌های طراحی"
        description="ایده‌های تأییدشده برای پوستر یا کمپین"
      />
      <div className="flex flex-col gap-12">
        {briefs.length === 0 ? (
          <SurfaceCard variant="empty">سفارشی ثبت نشده است.</SurfaceCard>
        ) : null}
        {briefs.map((entry) => {
          const request = entry.request;
          if (!request) return null;
          return (
            <SurfaceCard
              key={entry._id}
              variant="panel"
              className="flex flex-col gap-12"
            >
              <div className="flex flex-wrap justify-between gap-12">
                <div>
                  <p className="text-body-sm font-bold text-foreground">
                    {entry.business?.name ?? "کسب‌وکار"}
                    <span className="font-normal text-surface-50">
                      {" · "}
                      {KIND_LABELS[entry.kind]}
                    </span>
                  </p>
                  <p className="mt-6 text-caption text-surface-50">
                    {formatJalali(new Date(entry.date), toPersianDigits)}
                    {" · موعد "}
                    {formatJalali(new Date(request.dueDate), toPersianDigits)}
                    {" · "}
                    {BRIEF_STATUS_LABELS[request.status]}
                  </p>
                </div>
              </div>
              <p className="text-body font-bold">{request.idea.title}</p>
              <p className="text-body-sm">{request.idea.caption}</p>
              <p className="text-caption text-surface-50">
                تصویر: {request.idea.visualDirection}
              </p>
              <form
                action={setBriefStatus}
                className="flex flex-wrap items-end gap-12"
              >
                <input type="hidden" name="id" value={entry._id} />
                <label className="flex flex-col gap-6 text-caption text-surface-50">
                  یادداشت استودیو
                  <input
                    name="adminNote"
                    defaultValue={request.adminNote}
                    className="rounded-lg border border-surface-25 bg-off-background px-12 py-10 text-body-sm text-foreground"
                  />
                </label>
                {(NEXT[request.status] ?? []).map((option) => (
                  <button
                    key={option.status}
                    type="submit"
                    name="status"
                    value={option.status}
                    className="rounded-full bg-shockingly-green px-16 py-8 text-caption font-bold text-background"
                  >
                    {option.label}
                  </button>
                ))}
              </form>
            </SurfaceCard>
          );
        })}
      </div>
    </div>
  );
}
