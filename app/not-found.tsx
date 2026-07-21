import { Container } from "@/components/Container";
import { PillButton } from "@/components/PillButton";
import { SectionEyebrow } from "@/components/SectionEyebrow";

export default function NotFound() {
  return (
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
  );
}
