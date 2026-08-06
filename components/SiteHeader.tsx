"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GradientCta } from "@/components/GradientCta";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const navLinks = [
  { href: "/services", label: "خدمات", className: "text-foreground" },
  {
    href: "/microservices",
    label: "نمونه‌کارها",
    className: "text-foreground",
  },
  { href: "/projects", label: "پروژه‌ها", className: "text-foreground" },
  { href: "/customers", label: "مشتریان", className: "text-foreground" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-surface-25/60 bg-background/90 backdrop-blur-sm">
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
                  className={`px-8 py-10 text-body-sm transition-colors hover:text-foreground ${link.className}`}
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
              className="inline-flex size-40 items-center justify-center rounded-full round-keep text-foreground lg:hidden"
              aria-expanded={open}
              aria-label="باز کردن منو"
              onClick={() => setOpen(true)}
            >
              <span className="text-body-sm">☰</span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-50 flex flex-col bg-background px-16 py-12 lg:hidden"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reduce ? 0 : 0.28, ease }}
          >
            <div className="flex items-center justify-between gap-16">
              <Link href="/" onClick={() => setOpen(false)}>
                <span className="text-body-sm font-bold text-shockingly-green">
                  موکیوب
                </span>
              </Link>
              <div className="flex items-center gap-12">
                <ThemeToggle />
                <button
                  type="button"
                  className="inline-flex size-40 items-center justify-center rounded-full round-keep text-foreground"
                  aria-label="بستن منو"
                  onClick={() => setOpen(false)}
                >
                  <span className="text-body-sm">✕</span>
                </button>
              </div>
            </div>

            <nav className="mt-24 flex flex-col gap-8">
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
              <div className="pt-8">
                <GradientCta href="/contact" onClick={() => setOpen(false)}>
                  تماس با ما
                </GradientCta>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
