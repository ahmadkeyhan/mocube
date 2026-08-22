import { Container } from "@/components/Container";
import { DataUnavailable } from "@/components/DataUnavailable";
import { GradientCta } from "@/components/GradientCta";
import { HeroIntro } from "@/components/motion/HeroIntro";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { PillButton } from "@/components/PillButton";
import { ServiceBlock } from "@/components/ServiceBlock";
import { ShowcaseCard } from "@/components/ShowcaseCard";
import { HomeThemeGate } from "@/components/theme/HomeThemeGate";
import { ThemeImage } from "@/components/theme/ThemeImage";
import { getProjectsWithRelations } from "@/lib/queries/projects";
import { getServices } from "@/lib/queries/services";
import { serviceImages } from "@/lib/service-images";
import { MdDesignServices, MdFolderOpen } from "react-icons/md";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [services, featuredProjects] = await Promise.all([
    getServices(),
    getProjectsWithRelations({ featured: true }),
  ]);

  return (
    <>
      <HomeThemeGate />
      <section className="relative min-h-svh overflow-hidden max-w-6xl mx-auto">
        <ThemeImage
          lightSrc="/hero-light.webp"
          darkSrc="/hero-dark.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <Container className="relative z-10 pt-32 pb-76 md:pt-64 text-center flex flex-col items-center">
          <HeroIntro
            headline={
              <h1 className="mt-16 max-w-none text-3xl leading-display font-bold tracking-heading-lg text-foreground sm:text-heading-lg sm:tracking-heading-lg w-[15ch]">
                سوخت خلاقیت برای رسیدن به مدار توجه
              </h1>
            }
            subcopy={
              <p className="mt-24 max-w-xl text-body-sm sm:text-body-lg  text-surface-50">
                استودیو خلاق موکیوب — هویت برند، تصویرسازی، وب و مرچندایز برای
                برندهایی که می‌خواهند دیده شوند.
              </p>
            }
            actions={
              <div className="mt-32 flex flex-wrap gap-16">
                <GradientCta href="/services">سرویس‌های موکیوب</GradientCta>
                <PillButton href="/projects">کاوش پروژه‌ها</PillButton>
              </div>
            }
          />
        </Container>
      </section>

      <section className="max-w-6xl mx-auto pb-76">
        <Container className="grid grid-cols-2 gap-12">
          <Reveal className="col-span-2 flex items-center justify-center mt-64 mb-16 gap-4 text-heading-sm tracking-heading-sm text-center md:text-heading md:tracking-heading">
            <MdDesignServices />
            <h2>
              سرویس‌های موکیوب
            </h2>
          </Reveal>
          {services.length > 0 ? (
            services.map((service, index) => (
              <div key={service._id} className="col-span-2 md:col-span-1">
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
            <DataUnavailable message="در حال حاضر امکان نمایش سرویس‌ها وجود ندارد. لطفاً دوباره تلاش کنید." />
          )}
        </Container>
      </section>

      <section className="border-t border-surface-25 py-76">
        <Container>
          <Reveal>
            <div className="mt-16 mb-32 flex flex-wrap items-end justify-between gap-16">
              <div className="flex items-center gap-4 text-heading-sm tracking-heading-sm text-foreground md:text-heading md:tracking-heading">
                <MdFolderOpen />
                <h2>
                  پروژه‌های منتخب
                </h2>
              </div>
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
