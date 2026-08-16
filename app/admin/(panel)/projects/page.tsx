import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { SurfaceCard } from "@/components/SurfaceCard";
import { deleteProject } from "@/lib/admin/actions/projects";
import { requireAdmin } from "@/lib/auth/guards";
import { toPersianDigits } from "@/lib/persian";
import { getProjectsWithRelations } from "@/lib/queries/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "پروژه‌ها",
};

export default async function AdminProjectsPage() {
  await requireAdmin();
  const projects = await getProjectsWithRelations();

  return (
    <div className="flex flex-col gap-24">
      <AdminPageHeader
        title="پروژه‌ها"
        description="میکروسرویس‌ها و گالری‌های هر پروژه"
        actionHref="/admin/projects/new"
        actionLabel="پروژه جدید"
      />

      <div className="flex flex-col gap-12">
        {projects.length === 0 ? (
          <SurfaceCard variant="empty">هنوز پروژه‌ای ثبت نشده است.</SurfaceCard>
        ) : null}

        {projects.map((project) => (
          <SurfaceCard key={project._id} variant="row">
            <div className="min-w-0">
              <p className="text-body-sm font-bold text-foreground">
                {project.title}
                {project.featured ? (
                  <span className="mr-8 text-caption text-shockingly-green">
                    شاخص
                  </span>
                ) : null}
              </p>
              <p className="mt-6 text-caption text-surface-50">
                <span dir="ltr">{project.slug}</span>
                {" · "}
                {project.customer?.name ?? "بدون مشتری"}
                {" · "}
                {toPersianDigits(project.galleries.length)} گالری
              </p>
            </div>

            <div className="flex items-center gap-12">
              <Link
                href={`/admin/projects/${project._id}`}
                className="rounded-full border border-surface-25 px-16 py-8 text-caption text-foreground transition-colors hover:border-shockingly-green"
              >
                ویرایش
              </Link>
              <DeleteButton action={deleteProject} id={project._id} />
            </div>
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}
