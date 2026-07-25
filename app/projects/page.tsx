import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { ProjectsFilter } from "@/components/ProjectsFilter";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { ShowcaseCard } from "@/components/ShowcaseCard";
import { getCustomers } from "@/lib/queries/customers";
import { getMicroServices } from "@/lib/queries/microServices";
import { getProjectsWithRelations } from "@/lib/queries/projects";
import { getServices } from "@/lib/queries/services";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "پروژه‌ها",
  description: "پروژه‌های موکیوب بر اساس خدمت، میکروسرویس و مشتری",
};

type PageProps = {
  searchParams: Promise<{
    service?: string;
    customer?: string;
    micro?: string;
  }>;
};

export default async function ProjectsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [projects, services, customers, microServices] = await Promise.all([
    getProjectsWithRelations({
      serviceSlug: params.service,
      customerSlug: params.customer,
      microSlug: params.micro,
    }),
    getServices(),
    getCustomers(),
    getMicroServices(),
  ]);

  return (
    <section className="py-76">
      <Container>
        <Reveal>
          <SectionEyebrow>پروژه‌ها</SectionEyebrow>
          <h1 className="mt-16 text-heading-sm tracking-heading-sm text-surface-cream md:text-heading md:tracking-heading">
            کارهایی که ساخته‌ایم
          </h1>
          <p className="mt-16 mb-32 max-w-2xl text-body-lg tracking-body-lg text-surface-50">
            فیلتر پروژه‌ها بر اساس خدمت، میکروسرویس یا مشتری.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <Suspense fallback={null}>
            <ProjectsFilter
              services={services.map((s) => ({ slug: s.slug, name: s.name }))}
              customers={customers.map((c) => ({
                slug: c.slug,
                name: c.name,
              }))}
              microServices={microServices.map((m) => ({
                slug: m.slug,
                name: m.name,
              }))}
            />
          </Suspense>
        </Reveal>

        {projects.length > 0 ? (
          <Stagger className="mt-32 grid gap-24 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ShowcaseCard
                key={project._id}
                href={`/projects/${project.slug}`}
                title={project.title}
                coverUrl={project.coverUrl}
                customerName={project.customer?.name}
                services={project.services.map((s) => ({
                  name: s.name,
                  color: s.color,
                }))}
              />
            ))}
          </Stagger>
        ) : (
          <p className="mt-32 text-body text-surface-50">
            پروژه‌ای با این فیلتر پیدا نشد.
          </p>
        )}
      </Container>
    </section>
  );
}
