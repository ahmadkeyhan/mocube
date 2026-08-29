import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { GradientCta } from "@/components/GradientCta";
import { HeroIntro } from "@/components/motion/HeroIntro";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { MicroServiceCard } from "@/components/MicroServiceCard";
import { OrganicBlob } from "@/components/OrganicBlob";
import { PillButton } from "@/components/PillButton";
import { PricingCard } from "@/components/PricingCard";
import { ShowcaseCard } from "@/components/ShowcaseCard";
import { ThemeImage } from "@/components/theme/ThemeImage";
import { getMicroServicesByServiceId } from "@/lib/queries/microServices";
import { getProjectsWithRelations } from "@/lib/queries/projects";
import { getServiceBySlug, getServices } from "@/lib/queries/services";
import { serviceColorClass, serviceGradient } from "@/lib/service-colors";
import { serviceImages } from "@/lib/service-images";
import { MdSearch } from "react-icons/md";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "سرویس یافت نشد" };
  return {
    title: service.name,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const imageSrc = serviceImages[service.slug];

  const [microServices, relatedProjects, services] = await Promise.all([
    getMicroServicesByServiceId(service._id),
    getProjectsWithRelations({
      serviceSlug: service.slug,
      featured: true,
    }),
    getServices(),
  ]);

  const reverse =
    services.findIndex((item) => item._id === service._id) % 2 === 1;

  return (
    <>
      <section className="relative overflow-hidden py-76">
        {imageSrc ? (
          <>
            <ThemeImage
              lightSrc={imageSrc.light}
              darkSrc={imageSrc.dark}
              alt=""
              fill
              preload
              sizes="100vw"
              className="object-cover opacity-20"
            />
            <div
              className={`pointer-events-none absolute inset-0 from-background via-background/70 to-background/20 ${
                reverse ? "bg-linear-to-r" : "bg-linear-to-l"
              }`}
              aria-hidden
            />
          </>
        ) : (
          <>
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{ background: serviceGradient[service.color] }}
              aria-hidden
            />
            <div
              className={`pointer-events-none absolute top-20 opacity-60 ${
                reverse ? "right-0" : "left-0"
              }`}
            >
              <OrganicBlob
                color={service.color}
                className="max-w-70"
                delay={0.3}
              />
            </div>
          </>
        )}
        <Container
          className={`relative z-10 flex flex-col ${
            reverse ? "items-end text-end" : "items-start text-start"
          }`}
        >
          <HeroIntro
            eyebrow={
              <h1
                className={`text-subheading tracking-subheading md:text-heading-sm md:tracking-heading-sm lg:text-heading-lg lg:tracking-heading-lg ${serviceColorClass[service.color]}`}
              >
                {service.name}
              </h1>
            }
            headline={
              <p className="mt-16 max-w-3xl text-body-lg text-foreground">
                {service.shortDescription}
              </p>
            }
            subcopy={
              <p className="mt-20 max-w-2xl text-body-lg tracking-body-lg text-surface-50">
                {service.description}
              </p>
            }
            actions={
              <div className="mt-32">
                <GradientCta href={`/contact?service=${service.slug}`} color={service.color}>
                  درخواست این سرویس
                </GradientCta>
              </div>
            }
          />
        </Container>
      </section>

      <section className="border-t border-surface-25 py-76">
        <Container>
          <Reveal>
            <h2 className="mt-16 inline-flex items-center gap-1 text-heading-sm tracking-heading-sm text-foreground md:text-heading md:tracking-heading">
              <MdSearch aria-hidden className="size-24 shrink-0 md:size-32" />
              میکروسرویس‌ها
            </h2>
          </Reveal>
          <Stagger className="mt-32 grid gap-24 md:grid-cols-2">
            {microServices.map((micro) => (
              <MicroServiceCard
                key={micro._id}
                href={`/microservices/${micro.slug}`}
                name={micro.name}
                shortDescription={micro.shortDescription}
                color={service.color}
              />
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="border-t border-surface-25 py-76">
        <Container>
          <Reveal>
            <h2 className="mt-16 text-heading-sm tracking-heading-sm text-foreground md:text-heading md:tracking-heading">
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
                href={`/contact?service=${service.slug}&plan=${encodeURIComponent(plan.name)}`}
                color={service.color}
              />
            ))}
          </Stagger>
        </Container>
      </section>

      {relatedProjects.length > 0 ? (
        <section className="border-t border-surface-25 py-76">
          <Container>
            <Reveal>
              <div className="mt-16 mb-32 flex flex-wrap items-end justify-between gap-16">
                <h2 className="text-heading-sm tracking-heading-sm text-foreground md:text-heading md:tracking-heading">
                  پروژه‌های {service.name}
                </h2>
                <PillButton href={`/projects?service=${service.slug}`}>
                  کاوش همه پروژه‌ها
                </PillButton>
              </div>
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

      <section className="border-t border-surface-25 py-76">
        <Container className="text-center">
          <Reveal>
            <h2 className="mx-auto mt-16 max-w-2xl text-heading-sm tracking-heading-sm text-foreground md:text-heading md:tracking-heading">
              پروژه‌ات را با موکیوب شروع کن
            </h2>
            <div className="mt-32 flex justify-center">
              <GradientCta href={`/contact?service=${service.slug}`} color={service.color}>
                تماس با ما
              </GradientCta>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
