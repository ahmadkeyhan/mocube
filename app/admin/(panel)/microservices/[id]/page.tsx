import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MicroServiceForm } from "@/components/admin/forms/MicroServiceForm";
import { updateMicroService } from "@/lib/admin/actions/microServices";
import { getMicroServiceById } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/auth/guards";
import { getServices } from "@/lib/queries/services";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ویرایش میکروسرویس",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditMicroServicePage({ params }: PageProps) {
  await requireAdmin();

  const { id } = await params;
  const [micro, services] = await Promise.all([
    getMicroServiceById(id),
    getServices(),
  ]);
  if (!micro) notFound();

  return (
    <div className="flex max-w-180 flex-col gap-24">
      <AdminPageHeader title="ویرایش میکروسرویس" description={micro.name} />
      <MicroServiceForm
        action={updateMicroService}
        defaults={micro}
        serviceOptions={services.map((service) => ({
          value: service._id,
          label: service.name,
        }))}
      />
    </div>
  );
}
