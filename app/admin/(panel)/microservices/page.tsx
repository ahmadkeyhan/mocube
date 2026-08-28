import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { SurfaceCard } from "@/components/SurfaceCard";
import { deleteMicroService } from "@/lib/admin/actions/microServices";
import { requireAdmin } from "@/lib/auth/guards";
import { toPersianDigits } from "@/lib/persian";
import { getMicroServicesWithService } from "@/lib/queries/microServices";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "میکروسرویس‌ها",
};

export default async function AdminMicroServicesPage() {
  await requireAdmin();
  const microServices = await getMicroServicesWithService();

  return (
    <div className="flex flex-col gap-24">
      <AdminPageHeader
        title="میکروسرویس‌ها"
        description="میکروسرویس‌های هر سرویس"
        actionHref="/admin/microservices/new"
        actionLabel="میکروسرویس جدید"
      />

      <div className="flex flex-col gap-12">
        {microServices.length === 0 ? (
          <SurfaceCard variant="empty">هنوز میکروسرویسی ثبت نشده است.</SurfaceCard>
        ) : null}

        {microServices.map((micro) => (
          <SurfaceCard key={micro._id} variant="row">
            <div className="min-w-0">
              <p className="text-body-sm font-bold text-foreground">
                {micro.name}
              </p>
              <p className="mt-6 text-caption text-surface-50">
                <span dir="ltr">{micro.slug}</span>
                {" · "}
                {micro.service?.name ?? "بدون سرویس"}
                {" · "}
                ترتیب {toPersianDigits(micro.sortOrder)}
              </p>
            </div>

            <div className="flex items-center gap-12">
              <Link
                href={`/admin/microservices/${micro._id}`}
                className="rounded-full border border-surface-25 px-16 py-8 text-caption text-foreground transition-colors hover:border-shockingly-green"
              >
                ویرایش
              </Link>
              <DeleteButton action={deleteMicroService} id={micro._id} />
            </div>
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}
