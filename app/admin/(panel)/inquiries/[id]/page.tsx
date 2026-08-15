import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { SurfaceCard } from "@/components/SurfaceCard";
import {
  deleteInquiry,
  markInquiryRead,
} from "@/lib/admin/actions/inquiries";
import { requireAdmin } from "@/lib/auth/guards";
import { toPersianDigits } from "@/lib/persian";
import { getInquiryById } from "@/lib/queries/inquiries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "جزئیات درخواست",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-caption text-surface-50">{label}</p>
      <div className="mt-6 text-body-sm text-foreground">{children}</div>
    </div>
  );
}

export default async function AdminInquiryDetailPage({ params }: PageProps) {
  await requireAdmin();

  const { id } = await params;
  await markInquiryRead(id);
  const inquiry = await getInquiryById(id);
  if (!inquiry) notFound();

  return (
    <div className="flex max-w-[720px] flex-col gap-24">
      <AdminPageHeader
        title={inquiry.name}
        description={inquiry.businessName}
      />

      <SurfaceCard variant="panel" className="flex flex-col gap-20 hover:border-surface-25">
        <Row label="تلفن">
          <span dir="ltr">{toPersianDigits(inquiry.phone)}</span>
        </Row>
        <Row label="تاریخ">{formatDate(inquiry.createdAt)}</Row>
        <Row label="خدمات">
          {inquiry.services.length > 0
            ? inquiry.services.map((s) => s.name).join("، ")
            : "—"}
        </Row>
        <Row label="میکروسرویس‌ها">
          {inquiry.microServices.length > 0
            ? inquiry.microServices.map((m) => m.name).join("، ")
            : "—"}
        </Row>
        <Row label="پلن">
          {inquiry.plan
            ? `${inquiry.plan.planName} — ${inquiry.plan.priceLabel} (${inquiry.plan.serviceName})`
            : "—"}
        </Row>
        <Row label="توضیح">{inquiry.message || "—"}</Row>
      </SurfaceCard>

      <div>
        <DeleteButton action={deleteInquiry} id={inquiry._id} />
      </div>
    </div>
  );
}
