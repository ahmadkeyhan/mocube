import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MicroServiceForm } from "@/components/admin/forms/MicroServiceForm";
import { createMicroService } from "@/lib/admin/actions/microServices";
import { requireAdmin } from "@/lib/auth/guards";
import { getServices } from "@/lib/queries/services";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ریزسرویس جدید",
};

export default async function NewMicroServicePage() {
  await requireAdmin();
  const services = await getServices();

  return (
    <div className="flex max-w-[720px] flex-col gap-24">
      <AdminPageHeader title="ریزسرویس جدید" />
      <MicroServiceForm
        action={createMicroService}
        serviceOptions={services.map((service) => ({
          value: service._id,
          label: service.name,
        }))}
      />
    </div>
  );
}
