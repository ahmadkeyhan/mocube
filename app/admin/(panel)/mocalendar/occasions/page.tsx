import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { SurfaceCard } from "@/components/SurfaceCard";
import { deleteOccasion } from "@/lib/admin/actions/mocalendar";
import { requireAdmin } from "@/lib/auth/guards";
import { CALENDAR_LABELS, SCOPE_LABELS } from "@/lib/mocalendar/labels";
import { toPersianDigits } from "@/lib/persian";
import { getOccasions } from "@/lib/queries/mocalendar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "مناسبت‌ها",
};

export default async function AdminOccasionsPage() {
  await requireAdmin();
  const occasions = await getOccasions();

  return (
    <div className="flex flex-col gap-24">
      <AdminPageHeader
        title="مناسبت‌ها"
        description="کاتالوگ مناسبت‌های ملی، جهانی و حوزه‌ای"
        actionHref="/admin/mocalendar/occasions/new"
        actionLabel="مناسبت جدید"
      />
      <div className="flex flex-col gap-12">
        {occasions.length === 0 ? (
          <SurfaceCard variant="empty">
            مناسبتی نیست. اسکریپت seed-occasions را اجرا کنید.
          </SurfaceCard>
        ) : null}
        {occasions.map((occasion) => (
          <SurfaceCard key={occasion._id} variant="row">
            <div>
              <p className="text-body-sm font-bold text-foreground">
                {occasion.title}
                {!occasion.active ? (
                  <span className="font-normal text-surface-50">
                    {" "}
                    · غیرفعال
                  </span>
                ) : null}
              </p>
              <p className="mt-6 text-caption text-surface-50">
                {SCOPE_LABELS[occasion.scope]} ·{" "}
                {CALENDAR_LABELS[occasion.date.calendar]}{" "}
                {toPersianDigits(occasion.date.month)}/
                {toPersianDigits(occasion.date.day)}
                {occasion.fieldSlugs.length > 0
                  ? ` · ${toPersianDigits(occasion.fieldSlugs.length)} حوزه`
                  : " · همه حوزه‌ها"}
              </p>
            </div>
            <div className="flex items-center gap-12">
              <Link
                href={`/admin/mocalendar/occasions/${occasion._id}`}
                className="rounded-full border border-surface-25 px-16 py-8 text-caption"
              >
                ویرایش
              </Link>
              <DeleteButton action={deleteOccasion} id={occasion._id} />
            </div>
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}
