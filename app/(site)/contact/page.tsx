import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { surfaceCardClass } from "@/components/SurfaceCard";
import { toPersianDigits } from "@/lib/persian";
import { getMicroServicesWithService } from "@/lib/queries/microServices";
import { getServices } from "@/lib/queries/services";
import { getSiteSettings } from "@/lib/queries/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "تماس",
  description: "فرم درخواست پروژه و راه‌های ارتباط با استودیو خلاق موکیوب",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function asList(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const parts = Array.isArray(value) ? value : [value];
  return parts
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter(Boolean);
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [settings, services, microServices, params] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getMicroServicesWithService(),
    searchParams,
  ]);

  const phoneDigits = settings.phone.replace(/[^\d+]/g, "");
  const phoneDisplay = toPersianDigits(phoneDigits);
  const sent = params.sent === "1" || params.sent === "true";

  const serviceSlugs = new Set(services.map((service) => service.slug));
  const microBySlug = new Map(
    microServices.map((micro) => [micro.slug, micro]),
  );

  const initialMicroSlugs = asList(params.micro).filter((slug) =>
    microBySlug.has(slug),
  );
  const initialServiceSlugs = new Set(
    asList(params.service).filter((slug) => serviceSlugs.has(slug)),
  );
  for (const slug of initialMicroSlugs) {
    const parent = microBySlug.get(slug)?.service?.slug;
    if (parent) initialServiceSlugs.add(parent);
  }

  const planName =
    typeof params.plan === "string" ? params.plan.trim() : undefined;
  const planServiceSlug = [...initialServiceSlugs].find((slug) => {
    const service = services.find((item) => item.slug === slug);
    return service?.pricingPlans.some((plan) => plan.name === planName);
  });
  const initialPlan =
    planName && planServiceSlug
      ? { serviceSlug: planServiceSlug, planName }
      : null;

  return (
    <section className="py-76">
      <Container>
        <Reveal>
          <SectionEyebrow>تماس</SectionEyebrow>
          <h1 className="mt-16 text-heading-sm tracking-heading-sm text-foreground md:text-heading md:tracking-heading">
            بیایید حرف بزنیم
          </h1>
          <p className="mt-16 max-w-2xl text-body-lg tracking-body-lg text-surface-50">
            فرم را پر کنید تا با شما تماس بگیریم. نام، تلفن و نام کسب‌وکار لازم
            است؛ جزئیات خدمت اختیاری است.
          </p>
        </Reveal>

        {sent ? (
          <p className="mt-32 rounded-lg border border-shockingly-green/50 bg-shockingly-green/10 px-20 py-16 text-body text-shockingly-green">
            درخواست شما ثبت شد. به‌زودی تماس می‌گیریم.
          </p>
        ) : null}

        <div className="mt-48 grid gap-48 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <ContactForm
            services={services.map((service) => ({
              slug: service.slug,
              name: service.name,
              pricingPlans: service.pricingPlans.map((plan) => ({
                name: plan.name,
                priceLabel: plan.priceLabel,
              })),
            }))}
            microServices={microServices.flatMap((micro) =>
              micro.service
                ? [
                    {
                      slug: micro.slug,
                      name: micro.name,
                      serviceSlug: micro.service.slug,
                    },
                  ]
                : [],
            )}
            initialServiceSlugs={[...initialServiceSlugs]}
            initialMicroSlugs={initialMicroSlugs}
            initialPlan={initialPlan}
          />

          <Stagger spring className="flex flex-col gap-24">
            <a
              href={`tel:${phoneDigits}`}
              className={surfaceCardClass("tileSoft")}
            >
              <p className="text-caption text-surface-50">تلفن</p>
              <p
                className="mt-16 text-subheading tracking-subheading text-foreground"
                dir="ltr"
              >
                {phoneDisplay}
              </p>
            </a>

            <a
              href={`https://instagram.com/${settings.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className={surfaceCardClass("tileSoft")}
            >
              <p className="text-caption text-surface-50">اینستاگرام</p>
              <p className="mt-16 text-subheading tracking-subheading text-shockingly-green">
                @{settings.instagram}
              </p>
            </a>

            <a
              href={`https://t.me/${settings.telegram}`}
              target="_blank"
              rel="noopener noreferrer"
              className={surfaceCardClass("tileSoft")}
            >
              <p className="text-caption text-surface-50">تلگرام</p>
              <p className="mt-16 text-subheading tracking-subheading text-shockingly-green">
                @{settings.telegram}
              </p>
            </a>
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
