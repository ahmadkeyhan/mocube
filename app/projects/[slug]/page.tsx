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

        {project.galleryUrls.length > 0 ? (
          <Stagger className="mt-24 grid gap-16 md:grid-cols-3">
            {project.galleryUrls.map((url) => (
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
        ) : null}

        <Reveal delay={0.15} className="mt-32">
          <PillButton href="/projects">بازگشت به نمونه‌کارها</PillButton>
        </Reveal>
      </Container>
    </section>
  );
}
