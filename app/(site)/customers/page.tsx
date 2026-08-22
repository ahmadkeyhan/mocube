import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { CustomerName } from "@/components/CustomerName";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { surfaceCardClass } from "@/components/SurfaceCard";
import { getCustomers } from "@/lib/queries/customers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "مشتریان",
  description: "برندهایی که با موکیوب کار کرده‌اند",
};

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <section className="py-76">
      <Container>
        <Reveal>
          <CustomerName>مشتریان</CustomerName>
          <h1 className="mt-16 text-heading-sm tracking-heading-sm text-foreground md:text-heading md:tracking-heading">
            برندهایی که ساخته‌ایم
          </h1>
          <p className="mt-16 mb-32 max-w-2xl text-body-lg tracking-body-lg text-surface-50">
            هر مشتری مجموعه‌ای از پروژه‌ها در سرویس‌های مختلف دارد.
          </p>
        </Reveal>

        <Stagger className="grid gap-24 sm:grid-cols-2 lg:grid-cols-3">
          {customers.map((customer) => (
            <Link
              key={customer._id}
              href={`/customers/${customer.slug}`}
              className={surfaceCardClass("tileHover")}
            >
              <div className="flex items-center gap-16">
                <div
                  className="flex size-48 shrink-0 items-center justify-center rounded-lg text-body-sm font-bold text-background"
                  style={{ background: customer.logoUrl }}
                >
                  {customer.name.slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <h2 className="text-body font-bold text-foreground">
                    <CustomerName>{customer.name}</CustomerName>
                  </h2>
                  <p className="mt-4 text-body-sm text-surface-50">
                    {customer.shortDescription}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
