import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { CustomerLogo } from "@/components/CustomerLogo";
import { CustomerName } from "@/components/CustomerName";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger } from "@/components/motion/Stagger";
import { ShowcaseCard } from "@/components/ShowcaseCard";
import { getCustomerBySlug } from "@/lib/queries/customers";
import { getProjectsWithRelations } from "@/lib/queries/projects";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const customer = await getCustomerBySlug(slug);
  if (!customer) return { title: "مشتری یافت نشد" };
  return {
    title: customer.name,
    description: customer.shortDescription,
  };
}

export default async function CustomerDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const customer = await getCustomerBySlug(slug);
  if (!customer) notFound();

  const projects = await getProjectsWithRelations({
    customerSlug: customer.slug,
  });

  return (
    <section className="py-76">
      <Container>
        <Reveal>
          <div className="mt-16 flex flex-wrap items-start gap-24">
            <CustomerLogo
              name={customer.name}
              logoUrl={customer.logoUrl}
              className="size-80"
            />
            <div>
              <h1 className="text-heading-sm tracking-heading-sm text-foreground md:text-heading md:tracking-heading">
                <CustomerName iconClassName="size-32 shrink-0 md:size-40">
                  {customer.name}
                </CustomerName>
              </h1>
              <p className="text-body text-surface-50">
                {customer.shortDescription}
              </p>
            </div>
          </div>
          <p className="mt-24 max-w-2xl text-body tracking-body text-surface-50">
            {customer.description}
          </p>
        </Reveal>

        <Reveal className="mt-76 mb-24">
          <h2 className="text-subheading tracking-subheading text-foreground">
            پروژه‌های {customer.name}
          </h2>
        </Reveal>

        {projects.length > 0 ? (
          <Stagger className="grid gap-24 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ShowcaseCard
                key={project._id}
                href={`/projects/${project.slug}`}
                title={project.title}
                coverUrl={project.coverUrl}
                services={project.services.map((s) => ({
                  name: s.name,
                  color: s.color,
                }))}
              />
            ))}
          </Stagger>
        ) : (
          <p className="text-body text-surface-50">
            هنوز پروژه‌ای برای این مشتری ثبت نشده است.
          </p>
        )}
      </Container>
    </section>
  );
}
