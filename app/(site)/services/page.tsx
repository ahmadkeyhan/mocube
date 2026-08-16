import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ServiceBlock } from "@/components/ServiceBlock";
import { getServices } from "@/lib/queries/services";
import { serviceImages } from "@/lib/service-images";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "سرویس‌ها",
  description: "سرویس‌های استودیو خلاق موکیوب: هویت برند، تصویرسازی، وب و مرچندایز",
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <section className="py-76">
      <Container className="grid grid-cols-2 gap-12">
        <Reveal className="col-span-2">
          <h1 className="mt-16 text-heading-sm tracking-heading-sm text-foreground md:text-heading md:tracking-heading">
            چهار تخصص، یک استودیو
          </h1>
          <p className="mt-16 max-w-2xl text-body-lg tracking-body-lg text-surface-50">
            هر سرویس مجموعه‌ای از میکروسرویس‌ها و سه پلن قیمتی دارد تا با مقیاس
            پروژه‌ات هماهنگ شود.
          </p>
        </Reveal>
        {services.map((service, index) => (
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
        ))}
      </Container>
    </section>
  );
}
