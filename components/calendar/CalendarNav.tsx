"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/calendar", label: "تقویم" },
  { href: "/calendar/profile", label: "پروفایل" },
];

export function CalendarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-8 lg:flex-col">
      {links.map((link) => {
        const active =
          link.href === "/calendar"
            ? pathname === "/calendar" || pathname.startsWith("/calendar/day")
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
