import type { Metadata } from "next";
import { BusinessProfileForm } from "@/components/calendar/BusinessProfileForm";
import { SurfaceCard } from "@/components/SurfaceCard";
import { requireBusiness } from "@/lib/auth/guards";
import { rotateShareToken } from "@/lib/mocalendar/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "پروفایل کسب‌وکار",
};

export default async function CalendarProfilePage() {
  const { business } = await requireBusiness();
  const shareUrl = `/calendar/share/${business.shareToken}`;
  const icsUrl = `/api/calendar/${business.shareToken}`;

  return (
    <div className="flex max-w-[720px] flex-col gap-24">
      <div>
        <h1 className="text-heading-sm tracking-heading-sm text-foreground">
          پروفایل کسب‌وکار
        </h1>
        <p className="mt-8 text-body-sm text-surface-50">
          حوزه و لحن را دقیق بنویسید تا مناسبت‌ها و ایده‌ها مرتبط باشند.
        </p>
      </div>
      <BusinessProfileForm business={business} />
      <SurfaceCard variant="panel" className="flex flex-col gap-12">
        <p className="text-body-sm font-bold text-foreground">اشتراک تقویم</p>
        <p className="text-caption text-surface-50">
          لینک فقط‌خواندنی برای تیم، و فایل ICS برای گوشی.
        </p>
        <a
          href={shareUrl}
          className="text-body-sm text-shockingly-green"
          dir="ltr"
        >
          {shareUrl}
        </a>
        <a
          href={icsUrl}
          className="text-body-sm text-shockingly-green"
          dir="ltr"
        >
          {icsUrl}
        </a>
        <form action={rotateShareToken}>
          <button
            type="submit"
            className="rounded-full border border-surface-25 px-16 py-8 text-caption"
          >
            ساخت لینک تازه
          </button>
        </form>
      </SurfaceCard>
    </div>
  );
}
