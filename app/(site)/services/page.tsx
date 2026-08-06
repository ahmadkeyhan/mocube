import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/motion/Reveal";
import { SectionEyebrow } from "@/components/SectionEyebrow";
import { ServiceBlock } from "@/components/ServiceBlock";
import { getServices } from "@/lib/queries/services";
import { serviceImages } from "@/lib/service-images";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "خدمات",
  description: "خدمات استودیو خلاق موکیوب: هویت برند، تصویرسازی، وب و مرچندایز",
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <section className="py-76">
      <Container>
        <Reveal>
          <SectionEyebrow>خدمات</SectionEyebrow>
          <h1 className="mt-16 text-heading-sm tracking-heading-sm text-foreground md:text-heading md:tracking-heading">
            چهار تخصص، یک استودیو
          </h1>
          <p className="mt-16 max-w-2xl text-body-lg tracking-body-lg text-surface-50">
            هر خدمت مجموعه‌ای از میکروسرویس‌ها و سه پلن قیمتی دارد تا با مقیاس
            پروژه‌ات هماهنگ شود.
          </p>
        </Reveal>
      </Container>
      <Container>
        {services.map((service, index) => (
          <div key={service._id} className="border-b border-surface-25">
            <ServiceBlock
              name={service.name}
              color={service.color}
              shortDescription={service.shortDescription}
              slug={service.slug}
              reverse={index % 2 === 1}
              imageSrc={serviceImages[service.slug]}
            />
          </div>
        ))}
      </Container>
    </section>
  );
}
