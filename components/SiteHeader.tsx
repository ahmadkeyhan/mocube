"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { GradientCta } from "@/components/GradientCta";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const navLinks = [
  { href: "/services", label: "خدمات", className: "text-surface-cream" },
  {
    href: "/microservices",
    label: "نمونه‌کارها",
    className: "text-surface-cream",
  },
  { href: "/projects", label: "پروژه‌ها", className: "text-surface-cream" },
  { href: "/customers", label: "مشتریان", className: "text-surface-cream" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <header className="sticky top-0 z-40 border-b border-surface-25/60 bg-just-black/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-16 px-16 py-12 md:px-24">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
        >
          <Link href="/">
            <h1 className="text-body-sm font-bold text-shockingly-green">
            موکیوب
            </h1>
          </Link>
        </motion.div>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.href + link.label}
              initial={reduce ? false : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 + index * 0.04, ease }}
            >
              <Link
                href={link.href}
                className={`px-8 py-10 text-body-sm transition-colors hover:text-surface-cream ${link.className}`}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="flex items-center gap-12">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3, ease }}
          >
            <ThemeToggle />
          </motion.div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.35, ease }}
            className="hidden sm:inline-flex"
          >
            <GradientCta href="/contact">تماس با ما</GradientCta>
          </motion.div>
          <button
            type="button"
            className="inline-flex size-40 items-center justify-center rounded-full text-surface-cream lg:hidden"
            aria-label={open ? "بستن منو" : "باز کردن منو"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="text-body-sm">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {open ? (
        <nav className="flex flex-col gap-8 border-t border-surface-25 px-16 py-16 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className={`py-8 text-body-sm ${link.className}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-12 pt-8">
            <ThemeToggle />
            <GradientCta href="/contact" onClick={() => setOpen(false)}>
              تماس با ما
            </GradientCta>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
