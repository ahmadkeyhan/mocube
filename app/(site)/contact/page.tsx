import type { Metadata } from "next";
import { FaInstagram, FaTelegramPlane } from "react-icons/fa";
import { MdPhone } from "react-icons/md";
import { ContactForm } from "@/components/ContactForm";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
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
    <section className="py-40">
      <Container>
        <Reveal>
          <h1 className="text-heading-sm tracking-heading-sm text-foreground md:text-heading md:tracking-heading">
            بیایید حرف بزنیم
          </h1>
          <p className="mt-16 max-w-2xl text-body-lg tracking-body-lg text-surface-50">
            اول سرویس، بعد مسیر (پلن یا بخش‌ها)، بعد جزئیات، و در آخر مشخصات
            تماس.
          </p>
        </Reveal>

        {sent ? (
          <p className="mt-32 rounded-lg border border-shockingly-green/50 bg-shockingly-green/10 px-20 py-16 text-body text-shockingly-green">
            درخواست شما ثبت شد. به‌زودی تماس می‌گیریم.
          </p>
        ) : null}

        <div
          className={
            sent
              ? "mt-48 grid gap-48"
              : "mt-48 grid gap-48 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
          }
        >
          {sent ? null : (
            <ContactForm
              services={services.map((service) => ({
                slug: service.slug,
                name: service.name,
                color: service.color,
                shortDescription: service.shortDescription,
                pricingPlans: service.pricingPlans.map((plan) => ({
                  name: plan.name,
                  priceLabel: plan.priceLabel,
                  features: plan.features,
                  highlighted: plan.highlighted,
                })),
              }))}
              microServices={microServices.flatMap((micro) =>
                micro.service
                  ? [
                      {
                        slug: micro.slug,
                        name: micro.name,
                        shortDescription: micro.shortDescription,
                        serviceSlug: micro.service.slug,
                      },
                    ]
                  : [],
              )}
              initialServiceSlugs={[...initialServiceSlugs]}
              initialMicroSlugs={initialMicroSlugs}
              initialPlan={initialPlan}
            />
          )}

          <Stagger spring className="flex flex-col gap-16">
            <a
              href={`tel:${phoneDigits}`}
              aria-label={`تلفن ${phoneDisplay}`}
              className={surfaceCardClass("row")}
            >
              <MdPhone className="size-24 shrink-0 text-surface-50" />
              <p className="text-body font-bold text-foreground" dir="ltr">
                {phoneDisplay}
              </p>
            </a>

            <a
              href={`https://instagram.com/${settings.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`اینستاگرام ${settings.instagram}`}
              className={surfaceCardClass("row")}
            >
              <FaInstagram className="size-24 shrink-0 text-surface-50" />
              <p
                className="text-body font-bold text-shockingly-green"
                dir="ltr"
              >
                @{settings.instagram}
              </p>
            </a>

            <a
              href={`https://t.me/${settings.telegram}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`تلگرام ${settings.telegram}`}
              className={surfaceCardClass("row")}
            >
              <FaTelegramPlane className="size-24 shrink-0 text-surface-50" />
              <p
                className="text-body font-bold text-shockingly-green"
                dir="ltr"
              >
                @{settings.telegram}
              </p>
            </a>
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
