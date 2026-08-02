import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ServiceForm } from "@/components/admin/forms/ServiceForm";
import { createService } from "@/lib/admin/actions/services";
import { requireAdmin } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "خدمت جدید",
};

export default async function NewServicePage() {
  await requireAdmin();

  return (
    <div className="flex max-w-[720px] flex-col gap-24">
      <AdminPageHeader title="خدمت جدید" />
      <ServiceForm action={createService} />
    </div>
  );
}
