"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "داشبورد" },
  { href: "/admin/inquiries", label: "درخواست‌ها" },
  { href: "/admin/projects", label: "پروژه‌ها" },
  { href: "/admin/customers", label: "مشتریان" },
  { href: "/admin/services", label: "سرویس‌ها" },
  { href: "/admin/microservices", label: "میکروسرویس‌ها" },
  { href: "/admin/mocalendar/businesses", label: "کسب‌وکارها" },
  { href: "/admin/mocalendar/occasions", label: "مناسبت‌ها" },
  { href: "/admin/mocalendar/briefs", label: "سفارش طراحی" },
  { href: "/admin/settings", label: "تنظیمات سایت" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-8 lg:flex-col">
      {links.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-lg px-16 py-10 text-body-sm transition-colors ${
              active
                ? "bg-shockingly-green text-background font-bold"
                : "text-surface-50 hover:text-foreground"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
