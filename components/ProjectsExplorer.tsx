"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ProjectsFilter,
  type FilterOption,
  type ProjectsFilterValue,
} from "@/components/ProjectsFilter";
import { ShowcaseCard } from "@/components/ShowcaseCard";
import type { ServiceColor } from "@/lib/models/types";

export type ExplorerProject = {
  _id: string;
  slug: string;
  title: string;
  coverUrl: string;
  customer: { slug: string; name: string } | null;
  services: { slug: string; name: string; color: ServiceColor }[];
  microServices: { slug: string; name: string }[];
};

type ProjectsExplorerProps = {
  projects: ExplorerProject[];
  services: FilterOption[];
  customers: FilterOption[];
  microServices: FilterOption[];
};

function readFilters(params: URLSearchParams): ProjectsFilterValue {
  return {
    service: params.get("service"),
    customer: params.get("customer"),
    micro: params.get("micro"),
  };
}

function buildFilterUrl(pathname: string, filters: ProjectsFilterValue) {
  if (filters.service) return `${pathname}?service=${filters.service}`;
  if (filters.customer) return `${pathname}?customer=${filters.customer}`;
  if (filters.micro) return `${pathname}?micro=${filters.micro}`;
  return pathname;
}

function matchesFilter(
  project: ExplorerProject,
  filters: ProjectsFilterValue,
) {
  if (filters.service) {
    return project.services.some((s) => s.slug === filters.service);
  }
  if (filters.customer) {
    return project.customer?.slug === filters.customer;
  }
  if (filters.micro) {
    return project.microServices.some((m) => m.slug === filters.micro);
  }
  return true;
}

export function ProjectsExplorer({
  projects,
  services,
  customers,
  microServices,
}: ProjectsExplorerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<ProjectsFilterValue>(() =>
    readFilters(new URLSearchParams(searchParams.toString())),
  );

  useEffect(() => {
    const onPopState = () => {
      setFilters(readFilters(new URLSearchParams(window.location.search)));
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const applyFilters = useCallback(
    (next: ProjectsFilterValue) => {
      setFilters(next);
      const url = buildFilterUrl(pathname, next);
      window.history.pushState(null, "", url);
    },
    [pathname],
  );

  const visible = useMemo(
    () => projects.filter((project) => matchesFilter(project, filters)),
    [projects, filters],
  );

  return (
    <>
      <ProjectsFilter
        services={services}
        customers={customers}
        microServices={microServices}
        value={filters}
        onServiceChange={(slug) =>
          applyFilters(
            slug
              ? { service: slug, customer: null, micro: null }
              : { service: null, customer: null, micro: null },
          )
        }
        onCustomerChange={(slug) =>
          applyFilters(
            slug
              ? { service: null, customer: slug, micro: null }
              : { service: null, customer: null, micro: null },
          )
        }
        onMicroChange={(slug) =>
          applyFilters({ service: null, customer: null, micro: slug })
        }
        onClear={() =>
          applyFilters({ service: null, customer: null, micro: null })
        }
      />

      {visible.length > 0 ? (
        <div className="mt-32 grid gap-24 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <ShowcaseCard
              key={project._id}
              href={`/projects/${project.slug}`}
              title={project.title}
              coverUrl={project.coverUrl}
              customerName={project.customer?.name}
              services={project.services.map((s) => ({
                name: s.name,
                color: s.color,
              }))}
            />
          ))}
        </div>
      ) : (
        <p className="mt-32 text-body text-surface-50">
          پروژه‌ای با این فیلتر پیدا نشد.
        </p>
      )}
    </>
  );
}
