"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type GalleryMicroLink = {
  name: string;
  slug: string;
};

type GalleryLightboxProps = {
  open: boolean;
  urls: string[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  description?: string;
  micros?: GalleryMicroLink[];
  projectTitle?: string;
  projectHref?: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

function isColorPlaceholder(url: string) {
  return url.startsWith("#");
}

export function GalleryLightbox({
  open,
  urls,
  index,
  onClose,
  onIndexChange,
  description,
  micros = [],
  projectTitle,
  projectHref,
}: GalleryLightboxProps) {
  const reduce = useReducedMotion();
  const labelId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const url = urls[index];
  const hasNav = urls.length > 1;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (!hasNav) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onIndexChange((index + 1) % urls.length);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onIndexChange((index - 1 + urls.length) % urls.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasNav, index, onClose, onIndexChange, open, urls.length]);

  if (!mounted) return null;

  const goPrev = () => onIndexChange((index - 1 + urls.length) % urls.length);
  const goNext = () => onIndexChange((index + 1) % urls.length);

  return createPortal(
    <AnimatePresence>
      {open && url ? (
        <motion.div
          key="gallery-lightbox"
          className="fixed inset-0 z-50 flex items-center justify-center p-16 md:p-32"
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelId}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.28, ease }}
        >
          <button
            type="button"
            aria-label="بستن"
            className="absolute inset-0 bg-just-black/90 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            className="relative z-10 flex max-h-[min(92vh,920px)] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-surface-25 bg-off-black"
            initial={reduce ? false : { opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.35, ease }}
          >
            <div className="flex items-center justify-between gap-16 border-b border-surface-25 px-16 py-12 md:px-24">
              <p id={labelId} className="text-body-sm text-surface-50">
                {index + 1} / {urls.length}
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="rounded-full border border-surface-25 px-16 py-8 text-body-sm font-bold text-surface-cream transition-colors hover:border-surface-50 hover:text-shockingly-green"
              >
                بستن
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center bg-just-black px-16 py-24 md:px-32">
              {hasNav ? (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="تصویر قبلی"
                    className="absolute top-1/2 right-8 z-10 -translate-y-1/2 rounded-full border border-surface-25 bg-just-black/80 px-12 py-12 text-body-sm text-surface-cream backdrop-blur-sm transition-colors hover:border-surface-50 hover:text-shockingly-green md:left-16"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="تصویر بعدی"
                    className="absolute top-1/2 left-8 z-10 -translate-y-1/2 rounded-full border border-surface-25 bg-just-black/80 px-12 py-12 text-body-sm text-surface-cream backdrop-blur-sm transition-colors hover:border-surface-50 hover:text-shockingly-green md:right-16"
                  >
                    ›
                  </button>
                </>
              ) : null}

              <AnimatePresence mode="wait">
                <motion.div
                  key={url}
                  className="relative flex h-[min(58vh,560px)] w-full items-center justify-center"
                  initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, ease }}
                >
                  {isColorPlaceholder(url) ? (
                    <div
                      className="h-full w-full max-w-3xl rounded-lg"
                      style={{ background: url }}
                    />
                  ) : (
                    <Image
                      src={url}
                      alt=""
                      width={1600}
                      height={1200}
                      className="max-h-[min(58vh,560px)] w-auto max-w-full rounded-lg object-contain"
                      sizes="(max-width: 768px) 100vw, 900px"
                      priority
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {description ||
            micros.length > 0 ||
            (projectTitle && projectHref) ? (
              <div className="border-t border-surface-25 px-16 py-16 md:px-24">
                {projectTitle && projectHref ? (
                  <Link
                    href={projectHref}
                    className="text-body font-bold text-surface-cream hover:underline"
                  >
                    {projectTitle}
                  </Link>
                ) : null}
                {description ? (
                  <p
                    className={`max-w-2xl text-body text-surface-50 ${
                      projectTitle && projectHref ? "mt-12" : ""
                    }`}
                  >
                    {description}
                  </p>
                ) : null}
                {micros.length > 0 ? (
                  <div className="mt-12 flex flex-wrap gap-12">
                    {micros.map((micro) => (
                      <Link
                        key={micro.slug}
                        href={`/microservices/${micro.slug}`}
                        className="rounded-full border border-surface-25 px-16 py-8 text-body-sm text-surface-50 transition-colors hover:border-surface-50 hover:text-surface-cream"
                      >
                        {micro.name}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
