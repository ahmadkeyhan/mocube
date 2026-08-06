import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { surfaceCardClass } from "@/components/SurfaceCard";
import { toPersianDigits } from "@/lib/persian";
import { getSiteSettings } from "@/lib/queries/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "تماس",
  description: "تماس با استودیو خلاق موکیوب از طریق تلفن، اینستاگرام و تلگرام",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const phoneDigits = settings.phone.replace(/[^\d+]/g, "");
  const phoneDisplay = toPersianDigits(phoneDigits);

  return (
    <section className="py-76">
      <Container>
        <Reveal>
          <SectionEyebrow>تماس</SectionEyebrow>
          <h1 className="mt-16 text-heading-sm tracking-heading-sm text-foreground md:text-heading md:tracking-heading">
            بیایید حرف بزنیم
          </h1>
          <p className="mt-16 max-w-2xl text-body-lg tracking-body-lg text-surface-50">
            برای شروع پروژه، از یکی از کانال‌های زیر پیام بدهید.
          </p>
        </Reveal>

        <Stagger spring className="mt-48 grid gap-24 md:grid-cols-3">
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
      </Container>
    </section>
  );
}
