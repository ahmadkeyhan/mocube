import { Container } from "@/components/Container";
import { PillButton } from "@/components/PillButton";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteSettings } from "@/lib/queries/site";

export default async function NotFound() {
  const settings = await getSiteSettings();

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="py-108">
          <Container className="text-center">
            <SectionEyebrow>۴۰۴</SectionEyebrow>
            <h1 className="mt-16 text-heading-sm tracking-heading-sm text-surface-cream">
              صفحه پیدا نشد
            </h1>
            <p className="mt-16 text-body text-surface-50">
              این مسیر وجود ندارد یا حذف شده است.
            </p>
            <div className="mt-32 flex justify-center">
              <PillButton href="/">بازگشت به خانه</PillButton>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
