import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryLabel } from "@/components/CategoryLabel";
import { Container } from "@/components/Container";
import { CustomerName } from "@/components/CustomerName";
import { GalleryGrid } from "@/components/GalleryGrid";
import { Reveal } from "@/components/motion/Reveal";
import { PillButton } from "@/components/PillButton";
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

  const coverIsColor = project.coverUrl.startsWith("#");

  return (
    <section className="py-40">
      <Container>
        <Reveal>
          <article className="card-chrome overflow-hidden rounded-lg bg-off-background">
            <div className="flex flex-col lg:flex-row lg:items-stretch">
              <div
                className="relative aspect-video w-full lg:min-h-80 lg:w-1/2"
                style={{
                  background: coverIsColor
                    ? project.coverUrl
                    : `center / cover no-repeat url(${project.coverUrl})`,
                }}
              >
                {coverIsColor ? (
                  <div className="absolute inset-0 opacity-40 mix-blend-screen" />
                ) : null}
              </div>

              <div className="w-full p-20 lg:min-w-0 lg:flex-1 lg:p-32">
                <h1 className="text-heading-sm tracking-heading-sm text-foreground md:text-heading md:tracking-heading">
                  {project.title}
                </h1>
                <p className="mt-8 max-w-2xl text-body-lg tracking-body-lg text-surface-50">
                  {project.description}
                </p>

                {project.customer ? (
                  <p className="mt-16 text-body-sm text-surface-50">
                    <Link
                      href={`/customers/${project.customer.slug}`}
                      className="hover:text-foreground"
                    >
                      <CustomerName iconClassName="size-20 shrink-0">
                        {project.customer.name}
                      </CustomerName>
                    </Link>
                  </p>
                ) : null}

                {project.services.length > 0 ? (
                  <div className="mt-12 flex flex-wrap gap-2">
                    {project.services.map((service) => (
                      <Link key={service._id} href={`/services/${service.slug}`}>
                        <CategoryLabel
                          label={service.name}
                          color={service.color}
                          className="text-caption bg-background rounded-full"
                        />
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </article>
        </Reveal>

        {project.galleries.map((gallery, index) => (
          <Reveal
            key={`${gallery.urls[0]}-${index}`}
            delay={0.12 + index * 0.04}
            className="mt-24"
          >
            <article className="card-chrome rounded-lg bg-off-background p-2 md:p-24">
              {gallery.description ? (
                <p className="mb-16 px-2 pt-2 max-w-2xl text-body-lg tracking-body-lg text-foreground">
                  {gallery.description}
                </p>
              ) : null}
              {gallery.microServiceIds.length > 0 ? (
                <div className="mb-16 px-2 flex flex-wrap gap-2">
                  {gallery.microServiceIds.map((id) => {
                    const micro = project.microById[id];
                    if (!micro) return null;
                    return (
                      <Link
                        key={id}
                        href={`/microservices/${micro.slug}`}
                        className="rounded-full bg-background px-2 py-1 text-caption text-surface-50 transition-colors hover:text-foreground"
                      >
                        {micro.name}
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
            </article>
          </Reveal>
        ))}

        <Reveal delay={0.15} className="mt-32">
          <PillButton href="/projects">بازگشت به پروژه‌ها</PillButton>
        </Reveal>
      </Container>
    </section>
  );
}
