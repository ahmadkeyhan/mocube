import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { SurfaceCard } from "@/components/SurfaceCard";
import { deleteInquiry } from "@/lib/admin/actions/inquiries";
import { requireAdmin } from "@/lib/auth/guards";
import { toPersianDigits } from "@/lib/persian";
import { getInquiries } from "@/lib/queries/inquiries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "درخواست‌ها",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function AdminInquiriesPage() {
  await requireAdmin();
  const inquiries = await getInquiries();

  return (
    <div className="flex flex-col gap-24">
      <AdminPageHeader
        title="درخواست‌ها"
        description="فرم‌های ارسال‌شده از صفحه تماس"
      />

      <div className="flex flex-col gap-12">
        {inquiries.length === 0 ? (
          <SurfaceCard variant="empty">هنوز درخواستی ثبت نشده است.</SurfaceCard>
        ) : null}

        {inquiries.map((inquiry) => (
          <SurfaceCard key={inquiry._id} variant="row">
            <div className="min-w-0">
              <p className="text-body-sm font-bold text-foreground">
                {!inquiry.read ? (
                  <span className="me-8 inline-block size-8 rounded-full bg-shockingly-green" />
                ) : null}
                {inquiry.name}
                <span className="text-surface-50 font-normal">
                  {" · "}
                  {inquiry.businessName}
                </span>
              </p>
              <p className="mt-6 text-caption text-surface-50">
                <span dir="ltr">{toPersianDigits(inquiry.phone)}</span>
                {" · "}
                {formatDate(inquiry.createdAt)}
                {inquiry.services.length > 0
                  ? ` · ${inquiry.services.map((s) => s.name).join("، ")}`
                  : null}
              </p>
            </div>

            <div className="flex items-center gap-12">
              <Link
                href={`/admin/inquiries/${inquiry._id}`}
                className="rounded-full border border-surface-25 px-16 py-8 text-caption text-foreground transition-colors hover:border-shockingly-green"
              >
                مشاهده
              </Link>
              <DeleteButton action={deleteInquiry} id={inquiry._id} />
            </div>
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}
