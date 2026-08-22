import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { CustomerCard } from "@/components/CustomerCard";
import { CustomerName } from "@/components/CustomerName";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
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
            <CustomerCard
              key={customer._id}
              href={`/customers/${customer.slug}`}
              name={customer.name}
              logoUrl={customer.logoUrl}
              shortDescription={customer.shortDescription}
            />
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
