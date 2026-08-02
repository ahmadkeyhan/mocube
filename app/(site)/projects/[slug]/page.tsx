import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryLabel } from "@/components/CategoryLabel";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { PillButton } from "@/components/PillButton";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { getProjectBySlug } from "@/lib/queries/projects";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "پروژه یافت نشد" };
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <section className="py-76">
      <Container>
        <Reveal>
          <SectionEyebrow>پروژه</SectionEyebrow>
          <h1 className="mt-16 max-w-4xl text-heading-sm tracking-heading-sm text-surface-cream md:text-heading md:tracking-heading">
            {project.title}
          </h1>
          <p className="mt-20 max-w-2xl text-body-lg tracking-body-lg text-surface-50">
            {project.description}
          </p>

          <div className="mt-24 flex flex-wrap items-center gap-16">
            {project.customer ? (
              <Link
                href={`/customers/${project.customer.slug}`}
                className="text-body-sm text-shockingly-green hover:underline"
              >
                مشتری: {project.customer.name}
              </Link>
            ) : null}
            {project.services.map((service) => (
              <Link key={service._id} href={`/services/${service.slug}`}>
                <CategoryLabel label={service.name} color={service.color} />
              </Link>
            ))}
          </div>

          {project.microServices.length > 0 ? (
            <div className="mt-16 flex flex-wrap gap-12">
              {project.microServices.map((micro) => (
                <Link
                  key={micro._id}
                  href={`/microservices/${micro.slug}`}
                  className="text-body-sm text-surface-50 underline-offset-4 hover:text-surface-cream hover:underline"
                >
                  {micro.name}
                </Link>
              ))}
            </div>
          ) : null}
        </Reveal>

        <Reveal delay={0.1} className="mt-32">
          <div
            className="aspect-[16/9] w-full rounded-lg"
            style={{
              background: project.coverUrl.startsWith("#")
                ? project.coverUrl
                : `center / cover no-repeat url(${project.coverUrl})`,
            }}
          />
        </Reveal>

        {project.galleries.map((gallery, index) => (
          <Reveal
            key={`${gallery.urls[0]}-${index}`}
            delay={0.12 + index * 0.04}
            className="mt-32"
          >
            {gallery.description ? (
              <p className="mb-16 max-w-2xl text-body text-surface-50">
                {gallery.description}
              </p>
            ) : null}
            {gallery.microServiceIds.length > 0 ? (
              <div className="mb-16 flex flex-wrap gap-12">
                {gallery.microServiceIds.map((id) => {
                  const micro = project.microById[id];
                  if (!micro) return null;
                  return (
                    <Link
                      key={id}
                      href={`/microservices/${micro.slug}`}
                      className="rounded-full border border-surface-25 px-16 py-8 text-body-sm text-surface-50 transition-colors hover:border-surface-50 hover:text-surface-cream"
                    >
                      {micro.name}
                    </Link>
                  );
                })}
              </div>
            ) : null}
            <Stagger className="grid gap-16 md:grid-cols-3">
              {gallery.urls.map((url) => (
                <div
                  key={url}
                  className="aspect-square rounded-lg"
                  style={{
                    background: url.startsWith("#")
                      ? url
                      : `center / cover no-repeat url(${url})`,
                  }}
                />
              ))}
            </Stagger>
          </Reveal>
        ))}

        <Reveal delay={0.15} className="mt-32">
          <PillButton href="/projects">بازگشت به پروژه‌ها</PillButton>
        </Reveal>
      </Container>
    </section>
  );
}
