import type { Metadata } from "next";
import Link from "next/link";
import { CategoryLabel } from "@/components/CategoryLabel";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { surfaceCardClass } from "@/components/SurfaceCard";
import { getMicroServicesWithService } from "@/lib/queries/microServices";
import { MdSearch } from "react-icons/md";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "میکروسرویس‌ها",
  description: "میکروسرویس‌ها و نمونه‌های بصری موکیوب",
};

export default async function MicroServicesPage() {
  const microServices = await getMicroServicesWithService();

  return (
    <section className="py-76">
      <Container>
        <Reveal>
          <h1 className="mt-16 text-heading-sm tracking-heading-sm text-foreground md:text-heading md:tracking-heading">
            جزئیاتی که می‌توانید انتخاب کنید
          </h1>
          <p className="mt-16 mb-32 max-w-2xl text-body-lg tracking-body-lg text-surface-50">
            هر میکروسرویس مجموعه‌ای از گالری‌ها و نمونه‌های واقعی دارد.
          </p>
        </Reveal>

        {microServices.length > 0 ? (
          <Stagger className="grid gap-24 sm:grid-cols-2 lg:grid-cols-3">
            {microServices.map((micro) => (
              <Link
                key={micro._id}
                href={`/microservices/${micro.slug}`}
                className={surfaceCardClass("tileHover")}
              >
                {micro.service ? (
                  <CategoryLabel
                    label={micro.service.name}
                    color={micro.service.color}
                    className="text-body-sm"
                  />
                ) : null}
                <h2 className="mt-12 text-body font-bold text-foreground">
                  {micro.name}
                </h2>
                <p className="mt-8 text-body-sm text-surface-50">
                  {micro.shortDescription}
                </p>
              </Link>
            ))}
          </Stagger>
        ) : (
          <p className="text-body text-surface-50">
            هنوز میکروسرویسی ثبت نشده است.
          </p>
        )}
      </Container>
    </section>
  );
}
