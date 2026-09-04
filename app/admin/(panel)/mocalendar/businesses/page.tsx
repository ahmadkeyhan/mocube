import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SurfaceCard } from "@/components/SurfaceCard";
import { setBusinessStatus } from "@/lib/admin/actions/mocalendar";
import { requireAdmin } from "@/lib/auth/guards";
import { fieldName } from "@/lib/mocalendar/fields";
import { BUSINESS_STATUS_LABELS } from "@/lib/mocalendar/labels";
import { getBusinesses } from "@/lib/queries/mocalendar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "کسب‌وکارهای موکلندر",
};

export default async function AdminBusinessesPage() {
  await requireAdmin();
  const businesses = await getBusinesses();

  return (
    <div className="flex flex-col gap-24">
      <AdminPageHeader
        title="کسب‌وکارهای موکلندر"
        description="ثبت‌نام‌ها را تأیید یا رد کنید."
      />
      <div className="flex flex-col gap-12">
        {businesses.length === 0 ? (
          <SurfaceCard variant="empty">هنوز کسب‌وکاری ثبت نشده است.</SurfaceCard>
        ) : null}
        {businesses.map((item) => (
          <SurfaceCard key={item._id} variant="row">
            <div>
              <p className="text-body-sm font-bold text-foreground">
                {item.name}
                <span className="font-normal text-surface-50">
                  {" · "}
                  {BUSINESS_STATUS_LABELS[item.status]}
                </span>
              </p>
              <p className="mt-6 text-caption text-surface-50">
                {item.fieldSlug ? fieldName(item.fieldSlug) : "حوزه نامشخص"}
                {item.city ? ` · ${item.city}` : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-8">
              {item.status !== "active" ? (
                <form action={setBusinessStatus}>
                  <input type="hidden" name="id" value={item._id} />
                  <input type="hidden" name="status" value="active" />
                  <button
                    type="submit"
                    className="rounded-full bg-shockingly-green px-16 py-8 text-caption font-bold text-background"
                  >
                    تأیید
                  </button>
                </form>
              ) : null}
              {item.status !== "rejected" ? (
                <form action={setBusinessStatus}>
                  <input type="hidden" name="id" value={item._id} />
                  <input type="hidden" name="status" value="rejected" />
                  <button
                    type="submit"
                    className="rounded-full border border-lipstick-pink/60 px-16 py-8 text-caption text-lipstick-pink"
                  >
                    رد
                  </button>
                </form>
              ) : null}
            </div>
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}
