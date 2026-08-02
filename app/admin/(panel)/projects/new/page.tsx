import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProjectForm } from "@/components/admin/forms/ProjectForm";
import { createProject } from "@/lib/admin/actions/projects";
import { requireAdmin } from "@/lib/auth/guards";
import { getCustomers } from "@/lib/queries/customers";
import { getMicroServices } from "@/lib/queries/microServices";
import { getServices } from "@/lib/queries/services";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "پروژه جدید",
};

export default async function NewProjectPage() {
  await requireAdmin();

  const [customers, services, microServices] = await Promise.all([
    getCustomers(),
    getServices(),
    getMicroServices(),
  ]);

  return (
    <div className="flex max-w-[720px] flex-col gap-24">
      <AdminPageHeader title="پروژه جدید" />
      <ProjectForm
        action={createProject}
        customerOptions={customers.map((customer) => ({
          value: customer._id,
          label: customer.name,
        }))}
        serviceOptions={services.map((service) => ({
          value: service._id,
          label: service.name,
        }))}
        microServiceOptions={microServices.map((micro) => ({
          value: micro._id,
          label: micro.name,
        }))}
      />
    </div>
  );
}
