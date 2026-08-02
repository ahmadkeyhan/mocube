import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteMicroService } from "@/lib/admin/actions/microServices";
import { requireAdmin } from "@/lib/auth/guards";
import { toPersianDigits } from "@/lib/persian";
import { getMicroServicesWithService } from "@/lib/queries/microServices";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ریزخدمات",
};

export default async function AdminMicroServicesPage() {
  await requireAdmin();
  const microServices = await getMicroServicesWithService();

  return (
    <div className="flex flex-col gap-24">
      <AdminPageHeader
        title="ریزخدمات"
        description="ریزخدمت‌های هر خدمت"
        actionHref="/admin/microservices/new"
        actionLabel="ریزخدمت جدید"
      />

      <div className="flex flex-col gap-12">
        {microServices.length === 0 ? (
          <p className="rounded-lg border border-surface-25 p-24 text-body-sm text-surface-50">
            هنوز ریزخدمتی ثبت نشده است.
          </p>
        ) : null}

        {microServices.map((micro) => (
          <div
            key={micro._id}
            className="flex flex-wrap items-center justify-between gap-12 rounded-lg border border-surface-25 bg-off-black px-20 py-16"
          >
            <div className="min-w-0">
              <p className="text-body-sm font-bold text-surface-cream">
                {micro.name}
              </p>
              <p className="mt-6 text-caption text-surface-50">
                <span dir="ltr">{micro.slug}</span>
                {" · "}
                {micro.service?.name ?? "بدون خدمت"}
                {" · "}
                ترتیب {toPersianDigits(micro.sortOrder)}
              </p>
            </div>

            <div className="flex items-center gap-12">
              <Link
                href={`/admin/microservices/${micro._id}`}
                className="rounded-full border border-surface-25 px-16 py-8 text-caption text-surface-cream transition-colors hover:border-shockingly-green"
              >
                ویرایش
              </Link>
              <DeleteButton action={deleteMicroService} id={micro._id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
