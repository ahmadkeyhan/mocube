import { Container } from "@/components/Container";
import { DataUnavailable } from "@/components/DataUnavailable";
import { GradientCta } from "@/components/GradientCta";
import { HeroIntro } from "@/components/motion/HeroIntro";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { PillButton } from "@/components/PillButton";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { ServiceBlock } from "@/components/ServiceBlock";
import { ShowcaseCard } from "@/components/ShowcaseCard";
import { HomeThemeGate } from "@/components/theme/HomeThemeGate";
import { ThemeImage } from "@/components/theme/ThemeImage";
import { getProjectsWithRelations } from "@/lib/queries/projects";
import { getServices } from "@/lib/queries/services";
import { serviceImages } from "@/lib/service-images";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [services, featuredProjects] = await Promise.all([
    getServices(),
    getProjectsWithRelations({ featured: true }),
  ]);

  return (
    <>
      <HomeThemeGate />
      <section className="relative min-h-svh overflow-hidden max-w-[120rem] mx-auto">
        <ThemeImage
          lightSrc="/hero-light.webp"
          darkSrc="/hero-dark.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <Container className="relative z-10 pt-32 pb-76 md:pt-76 text-center flex flex-col items-center">
          <HeroIntro
            headline={
              <h1 className="mt-16 max-w-none text-3xl leading-display font-bold tracking-heading-lg text-foreground sm:text-heading-lg sm:tracking-heading-lg lg:text-display lg:tracking-display">
                سوخت خلاقیت برای رسیدن به مدار توجه
              </h1>
            }
            subcopy={
              <p className="mt-24 max-w-xl text-body-lg  text-surface-50">
                استودیو خلاق موکیوب — هویت برند، تصویرسازی، وب و مرچندایز برای
                برندهایی که می‌خواهند دیده شوند.
              </p>
            }
            actions={
              <div className="mt-32 flex flex-wrap gap-16">
                <GradientCta href="/contact">تماس با ما</GradientCta>
                <PillButton href="/microservices">کاوش نمونه‌کارها</PillButton>
              </div>
            }
          />
        </Container>
      </section>

      {/* <section className="border-t border-surface-25">
        <Container className="py-76">
          <Reveal>
            <SectionEyebrow>چرا موکیوب</SectionEyebrow>
            <h2 className="mt-16 max-w-3xl text-heading-sm tracking-heading-sm text-foreground md:text-heading md:tracking-heading">
              طراحی با رنگ، تایپ و حرکت — نه قالب‌های تکراری
            </h2>
          </Reveal>
        </Container>
      </section> */}

      <section className="border-t border-surface-25">
        <Container className="grid grid-cols-2 gap-12">
          <Reveal className="py-18 col-span-2">
            {/* <SectionEyebrow>ابزارهای موکیوب</SectionEyebrow> */}
            <h2 className="mt-16 text-heading-sm tracking-heading-sm text-center text-shockingly-green md:text-heading md:tracking-heading">
              خدمات موکیوب
            </h2>
          </Reveal>
          {services.length > 0 ? (
            services.map((service, index) => (
              <div key={service._id} className="col-span-2 lg:col-span-1">
                <ServiceBlock
                  name={service.name}
                  color={service.color}
                  shortDescription={service.shortDescription}
                  slug={service.slug}
                  reverse={index % 2 === 1}
                  imageSrc={serviceImages[service.slug]}
                />
              </div>
            ))
          ) : (
            <DataUnavailable message="در حال حاضر امکان نمایش خدمات وجود ندارد. لطفاً دوباره تلاش کنید." />
          )}
        </Container>
      </section>

      <section className="border-t border-surface-25 py-76">
        <Container>
          <Reveal>
            {/* <SectionEyebrow>پروژه‌ها</SectionEyebrow> */}
            <div className="mt-16 mb-32 flex flex-wrap items-end justify-between gap-16">
              <h2 className="text-heading-sm tracking-heading-sm text-foreground md:text-heading md:tracking-heading">
                پروژه‌های منتخب
              </h2>
              <PillButton href="/projects">کاوش همه پروژه‌ها</PillButton>
            </div>
          </Reveal>
          <Stagger className="grid gap-24 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.slice(0, 6).map((project) => (
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

      <section className="border-t border-surface-25 py-76">
        <Container className="text-center">
          <Reveal>
            {/* <SectionEyebrow>بعدی چیست؟</SectionEyebrow> */}
            <h2 className="mx-auto mt-16 max-w-2xl text-heading-sm tracking-heading-sm text-foreground md:text-heading md:tracking-heading">
              پروژه‌ات را با موکیوب شروع کن
            </h2>
            <div className="mt-32 flex justify-center">
              <GradientCta href="/contact">تماس با ما</GradientCta>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
