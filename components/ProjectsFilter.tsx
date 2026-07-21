"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type Option = { slug: string; name: string };

type ProjectsFilterProps = {
  services: Option[];
  customers: Option[];
};

export function ProjectsFilter({ services, customers }: ProjectsFilterProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const service = searchParams.get("service");
  const customer = searchParams.get("customer");

  const chipClass = (active: boolean) =>
    `rounded-full border px-16 py-8 text-body-sm transition-colors ${
      active
        ? "border-surface-cream text-surface-cream"
        : "border-surface-25 text-surface-50 hover:border-surface-50 hover:text-surface-cream"
    }`;

  return (
    <div className="flex flex-col gap-20">
      <div className="flex flex-wrap gap-12">
        <Link href={pathname} className={chipClass(!service && !customer)}>
          همه
        </Link>
        {services.map((item) => (
          <Link
            key={item.slug}
            href={`${pathname}?service=${item.slug}`}
            className={chipClass(service === item.slug && !customer)}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap gap-12">
        <span className="self-center text-caption text-surface-50">
          بر اساس مشتری:
        </span>
        {customers.map((item) => (
          <Link
            key={item.slug}
            href={`${pathname}?customer=${item.slug}`}
            className={chipClass(customer === item.slug)}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
