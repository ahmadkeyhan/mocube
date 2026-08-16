import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ServiceForm } from "@/components/admin/forms/ServiceForm";
import { updateService } from "@/lib/admin/actions/services";
import { getServiceById } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ویرایش سرویس",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditServicePage({ params }: PageProps) {
  await requireAdmin();

  const { id } = await params;
  const service = await getServiceById(id);
  if (!service) notFound();

  return (
    <div className="flex max-w-[720px] flex-col gap-24">
      <AdminPageHeader title="ویرایش سرویس" description={service.name} />
      <ServiceForm action={updateService} defaults={service} />
    </div>
  );
}
