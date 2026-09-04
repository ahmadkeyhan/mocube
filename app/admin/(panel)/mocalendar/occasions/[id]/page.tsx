import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { OccasionForm } from "@/components/admin/forms/OccasionForm";
import { updateOccasion } from "@/lib/admin/actions/mocalendar";
import { getOccasionById } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ویرایش مناسبت",
};

type PageProps = { params: Promise<{ id: string }> };

export default async function EditOccasionPage({ params }: PageProps) {
  await requireAdmin();
  const { id } = await params;
  const occasion = await getOccasionById(id);
  if (!occasion) notFound();

  return (
    <div className="flex max-w-[720px] flex-col gap-24">
      <AdminPageHeader title="ویرایش مناسبت" description={occasion.title} />
      <OccasionForm action={updateOccasion} defaults={occasion} />
    </div>
  );
}
