import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryLabel } from "@/components/CategoryLabel";
import { Container } from "@/components/Container";
import { GradientCta } from "@/components/GradientCta";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { OrganicBlob } from "@/components/OrganicBlob";
import { PricingCard } from "@/components/PricingCard";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { ShowcaseCard } from "@/components/ShowcaseCard";
import { getProjectsWithRelations } from "@/lib/queries/projects";
import { getServiceBySlug } from "@/lib/queries/services";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "خدمت یافت نشد" };
  return {
    title: service.name,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const relatedProjects = await getProjectsWithRelations({
    serviceSlug: service.slug,
  });

  return (
    <>
      <section className="relative overflow-hidden py-76">
        <div className="pointer-events-none absolute top-20 left-0 opacity-60">
          <OrganicBlob
            color={service.color}
            className="max-w-[280px]"
            delay={0.3}
          />
        </div>
        <Container className="relative">
          <Reveal>
            <SectionEyebrow>خدمت</SectionEyebrow>
            <CategoryLabel
              label={service.name}
              color={service.color}
              className="mt-16 block text-body-lg"
            />
            <h1 className="mt-16 max-w-3xl text-heading-sm tracking-heading-sm text-surface-cream md:text-heading md:tracking-heading">
              {service.shortDescription}
            </h1>
            <p className="mt-20 max-w-2xl text-body-lg tracking-body-lg text-surface-50">
              {service.description}
            </p>
            <div className="mt-32">
              <GradientCta href="/contact">درخواست این خدمت</GradientCta>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-surface-25 py-76">
        <Container>
          <Reveal>
            <SectionEyebrow>میکروسرویس‌ها</SectionEyebrow>
            <h2 className="mt-16 text-heading-sm tracking-heading-sm text-surface-cream">
              جزئیات قابل انتخاب
            </h2>
          </Reveal>
          <Stagger className="mt-32 grid gap-24 md:grid-cols-2">
            {service.microServices.map((micro) => (
              <div
                key={micro.slug}
                className="border-t border-surface-25 pt-24"
              >
                <h3 className="text-body font-bold text-surface-cream">
                  {micro.name}
                </h3>
                <p className="mt-12 text-body text-surface-50">
                  {micro.description}
                </p>
              </div>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="border-t border-surface-25 py-76">
        <Container>
          <Reveal>
            <SectionEyebrow>پلن‌ها</SectionEyebrow>
            <h2 className="mt-16 text-heading-sm tracking-heading-sm text-surface-cream">
              سه سطح قیمت‌گذاری
            </h2>
          </Reveal>
          <Stagger className="mt-32 grid gap-24 lg:grid-cols-3">
            {service.pricingPlans.map((plan) => (
              <PricingCard
                key={plan.name}
                name={plan.name}
                priceLabel={plan.priceLabel}
                features={plan.features}
                highlighted={plan.highlighted}
              />
            ))}
          </Stagger>
        </Container>
      </section>

      {relatedProjects.length > 0 ? (
        <section className="border-t border-surface-25 py-76">
          <Container>
            <Reveal>
              <SectionEyebrow>نمونه‌کارها</SectionEyebrow>
              <h2 className="mt-16 mb-32 text-heading-sm tracking-heading-sm text-surface-cream">
                پروژه‌های مرتبط با {service.name}
              </h2>
            </Reveal>
            <Stagger className="grid gap-24 md:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((project) => (
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
          </Container>
        </section>
      ) : null}
    </>
  );
}
