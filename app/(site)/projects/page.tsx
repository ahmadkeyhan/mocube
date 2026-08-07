import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectsExplorer } from "@/components/ProjectsExplorer";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { getCustomers } from "@/lib/queries/customers";
import { getMicroServicesWithService } from "@/lib/queries/microServices";
import { getProjectsWithRelations } from "@/lib/queries/projects";
import { getServices } from "@/lib/queries/services";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "پروژه‌ها",
  description: "پروژه‌های موکیوب بر اساس خدمت، میکروسرویس و مشتری",
};

export default async function ProjectsPage() {
  const [projects, services, customers, microServices] = await Promise.all([
    getProjectsWithRelations(),
    getServices(),
    getCustomers(),
    getMicroServicesWithService(),
  ]);

  return (
    <section className="py-40">
      <Container>
        <Reveal>
          <h1 className="text-heading-sm tracking-heading-sm text-foreground md:text-heading md:tracking-heading">
            پروژه‌های موکیوب
          </h1>
          <p className="mt-8 mb-32 max-w-2xl text-body-lg tracking-body-lg text-surface-50">
            -پروژه‌های قرارگرفته در مدار-
          </p>
        </Reveal>

        <Suspense fallback={null}>
          <ProjectsExplorer
            projects={projects.map((project) => ({
              _id: project._id,
              slug: project.slug,
              title: project.title,
              coverUrl: project.coverUrl,
              customer: project.customer
                ? { slug: project.customer.slug, name: project.customer.name }
                : null,
              services: project.services.map((s) => ({
                slug: s.slug,
                name: s.name,
                color: s.color,
              })),
              microServices: project.microServices.map((m) => ({
                slug: m.slug,
                name: m.name,
              })),
            }))}
            services={services.map((s) => ({ slug: s.slug, name: s.name }))}
            customers={customers.map((c) => ({
              slug: c.slug,
              name: c.name,
            }))}
            microServices={microServices.map((m) => ({
              slug: m.slug,
              name: m.name,
              color: m.service?.color ?? "shockingly-green",
            }))}
          />
        </Suspense>
      </Container>
    </section>
  );
}
