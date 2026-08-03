import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { SurfaceCard } from "@/components/SurfaceCard";
import { deleteService } from "@/lib/admin/actions/services";
import { SERVICE_COLOR_LABELS } from "@/lib/admin/constants";
import { requireAdmin } from "@/lib/auth/guards";
import { toPersianDigits } from "@/lib/persian";
import { getServices } from "@/lib/queries/services";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "خدمات",
};

export default async function AdminServicesPage() {
  await requireAdmin();
  const services = await getServices();

  return (
    <div className="flex flex-col gap-24">
      <AdminPageHeader
        title="خدمات"
        description="خدمات اصلی و پلن‌های قیمتی"
        actionHref="/admin/services/new"
        actionLabel="خدمت جدید"
      />

      <div className="flex flex-col gap-12">
        {services.length === 0 ? (
          <SurfaceCard variant="empty">هنوز خدمتی ثبت نشده است.</SurfaceCard>
        ) : null}

        {services.map((service) => (
          <SurfaceCard key={service._id} variant="row">
            <div className="min-w-0">
              <p className="text-body-sm font-bold text-surface-cream">
                {service.name}
              </p>
              <p className="mt-6 text-caption text-surface-50">
                <span dir="ltr">{service.slug}</span>
                {" · "}
                {SERVICE_COLOR_LABELS[service.color] ?? service.color}
                {" · "}
                ترتیب {toPersianDigits(service.sortOrder)}
                {" · "}
                {toPersianDigits(service.pricingPlans.length)} پلن
              </p>
            </div>

            <div className="flex items-center gap-12">
              <Link
                href={`/admin/services/${service._id}`}
                className="rounded-full border border-surface-25 px-16 py-8 text-caption text-surface-cream transition-colors hover:border-shockingly-green"
              >
                ویرایش
              </Link>
              <DeleteButton action={deleteService} id={service._id} />
            </div>
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}
