import { Container } from "@/components/Container";
import { GradientCta } from "@/components/GradientCta";
import { HeroIntro } from "@/components/motion/HeroIntro";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { OrganicBlob } from "@/components/OrganicBlob";
import { PillButton } from "@/components/PillButton";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { ServiceBlock } from "@/components/ServiceBlock";
import { ShowcaseCard } from "@/components/ShowcaseCard";
import { getProjectsWithRelations } from "@/lib/queries/projects";
import { getServices } from "@/lib/queries/services";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [services, featuredProjects] = await Promise.all([
    getServices(),
    getProjectsWithRelations({ featured: true }),
  ]);

  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-76 md:pt-76">
        <div className="pointer-events-none absolute top-20 -left-20 opacity-70 md:top-10 md:left-10">
          <OrganicBlob
            color="pink"
            className="max-w-[220px] md:max-w-[320px]"
            delay={0}
            duration={9}
          />
        </div>
        <div className="pointer-events-none absolute top-40 -right-16 opacity-60 md:top-32 md:right-20">
          <OrganicBlob
            color="orangey"
            className="max-w-[180px] md:max-w-[260px]"
            delay={1.2}
            duration={7}
          />
        </div>
        <div className="pointer-events-none absolute bottom-10 left-1/3 opacity-50">
          <OrganicBlob
            color="shockingly-green"
            className="max-w-[140px] md:max-w-[200px]"
            delay={0.6}
            duration={10}
          />
        </div>

        <Container className="relative">
          <HeroIntro
            eyebrow={<SectionEyebrow>موکیوب</SectionEyebrow>}
            headline={
              <h1 className="mt-16 max-w-none text-[64px] leading-display font-bold tracking-[-1.28px] text-surface-cream sm:text-heading-lg sm:tracking-heading-lg lg:text-display lg:tracking-display">
                هر چیزی را
                <br />
                زنده کن
              </h1>
            }
            subcopy={
              <p className="mt-24 max-w-xl text-body-lg tracking-body-lg text-surface-50">
                استودیو خلاق موکیوب — هویت برند، تصویرسازی، وب و مرچندایز برای
                برندهایی که می‌خواهند دیده شوند.
              </p>
            }
            actions={
              <div className="mt-32 flex flex-wrap gap-16">
                <GradientCta href="/contact">تماس با ما</GradientCta>
                <PillButton href="/projects">کاوش نمونه‌کارها</PillButton>
              </div>
            }
          />
        </Container>
      </section>

      <section className="border-t border-surface-25">
        <Container className="py-76">
          <Reveal>
            <SectionEyebrow>چرا موکیوب</SectionEyebrow>
            <h2 className="mt-16 max-w-3xl text-heading-sm tracking-heading-sm text-surface-cream md:text-heading md:tracking-heading">
              طراحی با رنگ، تایپ و حرکت — نه قالب‌های تکراری
            </h2>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-surface-25">
        <Container>
          <Reveal className="pt-76">
            <SectionEyebrow>ابزارهای موکیوب</SectionEyebrow>
            <h2 className="mt-16 text-heading-sm tracking-heading-sm text-surface-cream md:text-heading md:tracking-heading">
              چهار خدمت، یک زبان بصری
            </h2>
          </Reveal>
          {services.length > 0 ? (
            services.map((service, index) => (
              <div key={service._id} className="border-b border-surface-25">
                <ServiceBlock
                  name={service.name}
                  color={service.color}
                  shortDescription={service.shortDescription}
                  slug={service.slug}
                  reverse={index % 2 === 1}
                />
              </div>
            ))
          ) : (
            <p className="py-76 text-body text-surface-50">
              برای نمایش خدمات، دیتابیس را با{" "}
              <code className="text-shockingly-green">npm run seed</code> پر
              کنید.
            </p>
          )}
        </Container>
      </section>

      <section className="border-t border-surface-25 py-76">
        <Container>
          <Reveal>
            <SectionEyebrow>نمونه‌کارها</SectionEyebrow>
            <div className="mt-16 mb-32 flex flex-wrap items-end justify-between gap-16">
              <h2 className="text-heading-sm tracking-heading-sm text-surface-cream md:text-heading md:tracking-heading">
                پروژه‌های منتخب
              </h2>
              <PillButton href="/projects">کاوش همه نمونه‌کارها</PillButton>
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
            <SectionEyebrow>بعدی چیست؟</SectionEyebrow>
            <h2 className="mx-auto mt-16 max-w-2xl text-heading-sm tracking-heading-sm text-surface-cream md:text-heading md:tracking-heading">
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
