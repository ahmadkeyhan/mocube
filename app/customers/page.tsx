import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { SectionEyebrow } from "@/components/SectionEyebrow";
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
          <SectionEyebrow>مشتریان</SectionEyebrow>
          <h1 className="mt-16 text-heading-sm tracking-heading-sm text-surface-cream md:text-heading md:tracking-heading">
            برندهایی که ساخته‌ایم
          </h1>
          <p className="mt-16 mb-32 max-w-2xl text-body-lg tracking-body-lg text-surface-50">
            هر مشتری مجموعه‌ای از پروژه‌ها در خدمات مختلف دارد.
          </p>
        </Reveal>

        <Stagger className="grid gap-24 sm:grid-cols-2 lg:grid-cols-3">
          {customers.map((customer) => (
            <Link
              key={customer._id}
              href={`/customers/${customer.slug}`}
              className="rounded-lg border border-surface-25 p-24 transition-colors hover:border-surface-50 hover:bg-off-black"
            >
              <div
                className="mb-20 flex size-64 items-center justify-center rounded-lg text-body-sm font-bold text-just-black"
                style={{ background: customer.logoUrl }}
              >
                {customer.name.slice(0, 1)}
              </div>
              <h2 className="text-body font-bold text-surface-cream">
                {customer.name}
              </h2>
              <p className="mt-8 text-body-sm text-surface-50">
                {customer.shortDescription}
              </p>
            </Link>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
