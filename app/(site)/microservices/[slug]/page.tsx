import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryLabel } from "@/components/CategoryLabel";
import { Container } from "@/components/Container";
import { GalleryGrid } from "@/components/GalleryGrid";
import { GradientCta } from "@/components/GradientCta";
import { Reveal } from "@/components/motion/Reveal";
import { PillButton } from "@/components/PillButton";
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
    title: micro.name,
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
    <section className="py-40">
      <Container>
        <Reveal>
          <article className="card-chrome rounded-lg bg-off-background p-20 lg:p-32">
            {service ? (
              <Link href={`/services/${service.slug}`}>
                <CategoryLabel
                  label={service.name}
                  color={service.color}
                  className="text-caption bg-background rounded-full"
                />
              </Link>
            ) : null}
            <h1
              className={`${service ? "mt-12" : ""} text-heading-sm tracking-heading-sm text-foreground md:text-heading md:tracking-heading`}
            >
              {micro.name}
            </h1>
            <p className="mt-8 max-w-2xl text-body-lg tracking-body-lg text-surface-50">
              {micro.shortDescription}
            </p>
            {micro.description && micro.description !== micro.shortDescription ? (
              <p className="mt-12 max-w-2xl text-body text-surface-50">
                {micro.description}
              </p>
            ) : null}
            <div className="mt-24">
              <GradientCta
                href={
                  service
                    ? `/contact?service=${service.slug}&micro=${micro.slug}`
                    : "/contact"
                }
                color={service?.color}
              >
                درخواست این سرویس
              </GradientCta>
            </div>
          </article>
        </Reveal>

        {galleries.length > 0 ? (
          galleries.map((block, index) => (
            <Reveal
              key={`${block.projectSlug}-${block.gallery.urls[0]}`}
              delay={0.12 + index * 0.04}
              className="mt-24"
            >
              <article className="card-chrome rounded-lg bg-off-background p-2 md:p-24">
                <Link
                  href={`/projects/${block.projectSlug}`}
                  className="block px-2 pt-2 text-body font-bold text-foreground hover:text-shockingly-green md:px-0 md:pt-0"
                >
                  {block.projectTitle}
                </Link>
                {block.gallery.description ? (
                  <p className="mt-12 mb-16 max-w-2xl px-2 text-body-lg tracking-body-lg text-foreground md:px-0">
                    {block.gallery.description}
                  </p>
                ) : null}
                <GalleryGrid
                  className={block.gallery.description ? undefined : "mt-16"}
                  urls={block.gallery.urls}
                  description={block.gallery.description}
                  projectTitle={block.projectTitle}
                  projectHref={`/projects/${block.projectSlug}`}
                />
              </article>
            </Reveal>
          ))
        ) : (
          <p className="mt-24 text-body text-surface-50">
            هنوز گالری‌ای برای این میکروسرویس ثبت نشده است.
          </p>
        )}

        <Reveal delay={0.15} className="mt-32">
          <PillButton href="/microservices">بازگشت به میکروسرویس‌ها</PillButton>
        </Reveal>
      </Container>
    </section>
  );
}
