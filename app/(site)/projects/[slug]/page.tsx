import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryLabel } from "@/components/CategoryLabel";
import { Container } from "@/components/Container";
import { CustomerName } from "@/components/CustomerName";
import { GalleryGrid } from "@/components/GalleryGrid";
import { Reveal } from "@/components/motion/Reveal";
import { PillButton } from "@/components/PillButton";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { microHash } from "@/lib/micro-label";
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
          <h1 className="mt-16 max-w-4xl text-heading-sm tracking-heading-sm text-foreground md:text-heading md:tracking-heading">
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
                <CustomerName>{project.customer.name}</CustomerName>
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
                  className="text-body-sm text-surface-50 underline-offset-4 hover:text-foreground hover:underline"
                >
                  {microHash(micro.name)}
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
                      className="rounded-full border border-surface-25 px-16 py-8 text-body-sm text-surface-50 transition-colors hover:border-surface-50 hover:text-foreground"
                    >
                      {microHash(micro.name)}
                    </Link>
                  );
                })}
              </div>
            ) : null}
            <GalleryGrid
              urls={gallery.urls}
              description={gallery.description}
              micros={gallery.microServiceIds
                .map((id) => project.microById[id])
                .filter(
                  (m): m is NonNullable<typeof m> =>
                    m != null && Boolean(m.name) && Boolean(m.slug),
                )
                .map((m) => ({ name: m.name, slug: m.slug }))}
            />
          </Reveal>
        ))}

        <Reveal delay={0.15} className="mt-32">
          <PillButton href="/projects">بازگشت به پروژه‌ها</PillButton>
        </Reveal>
      </Container>
    </section>
  );
}
