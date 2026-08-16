import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaHashtag } from "react-icons/fa";
import { CategoryLabel } from "@/components/CategoryLabel";
import { Container } from "@/components/Container";
import { GalleryGrid } from "@/components/GalleryGrid";
import { GradientCta } from "@/components/GradientCta";
import { Reveal } from "@/components/motion/Reveal";
import { OrganicBlob } from "@/components/OrganicBlob";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { microHash } from "@/lib/micro-label";
import {
  getGalleriesForMicro,
  getMicroServiceBySlug,
} from "@/lib/queries/microServices";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const micro = await getMicroServiceBySlug(slug);
  if (!micro) return { title: "میکروسرویس یافت نشد" };
  return {
    title: microHash(micro.name),
    description: micro.shortDescription,
  };
}

export default async function MicroServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const micro = await getMicroServiceBySlug(slug);
  if (!micro) notFound();

  const galleries = await getGalleriesForMicro(micro._id);
  const service = micro.service;

  return (
    <>
      <section className="relative overflow-hidden py-76">
        {service ? (
          <div className="pointer-events-none absolute top-20 left-0 opacity-60">
            <OrganicBlob
              color={service.color}
              className="max-w-[280px]"
              delay={0.3}
            />
          </div>
        ) : null}
        <Container className="relative">
          <Reveal>
            <SectionEyebrow>
              <span className="inline-flex items-center gap-1">
                <FaHashtag aria-hidden className="size-16 shrink-0" />
                میکروسرویس
              </span>
            </SectionEyebrow>
            {service ? (
              <Link href={`/services/${service.slug}`} className="mt-16 block">
                <CategoryLabel
                  label={service.name}
                  color={service.color}
                  className="text-body-lg"
                />
              </Link>
            ) : null}
            <h1 className="mt-16 max-w-3xl text-heading-sm tracking-heading-sm text-foreground md:text-heading md:tracking-heading">
              {microHash(micro.name)}
            </h1>
            <p className="mt-20 max-w-2xl text-body-lg tracking-body-lg text-surface-50">
              {micro.shortDescription}
            </p>
            <p className="mt-16 max-w-2xl text-body text-surface-50">
              {micro.description}
            </p>
            <div className="mt-32">
              <GradientCta
                href={
                  service
                    ? `/contact?service=${service.slug}&micro=${micro.slug}`
                    : "/contact"
                }
              >
                درخواست این سرویس
              </GradientCta>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-surface-25 py-76">
        <Container>
          <Reveal>
            <SectionEyebrow>نمونه‌ها</SectionEyebrow>
            <h2 className="mt-16 text-heading-sm tracking-heading-sm text-foreground">
              گالری‌های مرتبط
            </h2>
          </Reveal>

          {galleries.length > 0 ? (
            <div className="mt-32 flex flex-col gap-76">
              {galleries.map((block) => (
                <Reveal key={`${block.projectSlug}-${block.gallery.urls[0]}`}>
                  <Link
                    href={`/projects/${block.projectSlug}`}
                    className="text-body font-bold text-foreground hover:underline"
                  >
                    {block.projectTitle}
                  </Link>
                  {block.gallery.description ? (
                    <p className="mt-12 max-w-2xl text-body text-surface-50">
                      {block.gallery.description}
                    </p>
                  ) : null}
                  <GalleryGrid
                    className="mt-24"
                    urls={block.gallery.urls}
                    description={block.gallery.description}
                    projectTitle={block.projectTitle}
                    projectHref={`/projects/${block.projectSlug}`}
                  />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="mt-32 text-body text-surface-50">
              هنوز گالری‌ای برای این میکروسرویس ثبت نشده است.
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
