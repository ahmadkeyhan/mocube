import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProjectForm } from "@/components/admin/forms/ProjectForm";
import { updateProject } from "@/lib/admin/actions/projects";
import { getProjectById } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/auth/guards";
import { getCustomers } from "@/lib/queries/customers";
import { getMicroServices } from "@/lib/queries/microServices";
import { getServices } from "@/lib/queries/services";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ویرایش پروژه",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: PageProps) {
  await requireAdmin();

  const { id } = await params;
  const [project, customers, services, microServices] = await Promise.all([
    getProjectById(id),
    getCustomers(),
    getServices(),
    getMicroServices(),
  ]);
  if (!project) notFound();

  return (
    <div className="flex max-w-[720px] flex-col gap-24">
      <AdminPageHeader title="ویرایش پروژه" description={project.title} />
      <ProjectForm
        action={updateProject}
        defaults={project}
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
