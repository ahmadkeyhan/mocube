import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { OccasionForm } from "@/components/admin/forms/OccasionForm";
import { createOccasion } from "@/lib/admin/actions/mocalendar";
import { requireAdmin } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "مناسبت جدید",
};

export default async function NewOccasionPage() {
  await requireAdmin();
  return (
    <div className="flex max-w-[720px] flex-col gap-24">
      <AdminPageHeader title="مناسبت جدید" />
      <OccasionForm action={createOccasion} />
    </div>
  );
}
