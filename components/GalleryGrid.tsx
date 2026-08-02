"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  GalleryLightbox,
  type GalleryMicroLink,
} from "@/components/GalleryLightbox";
import { Stagger } from "@/components/motion/Stagger";

type GalleryGridProps = {
  urls: string[];
  description?: string;
  micros?: GalleryMicroLink[];
  projectTitle?: string;
  projectHref?: string;
  className?: string;
};

const GAP = 16;
const PLACEHOLDER_HEIGHT = 160;
/** Fallback before natural size known (matches Image width/height hint). */
const DEFAULT_RATIO = 800 / 1200;

function isColorPlaceholder(url: string) {
  return url.startsWith("#");
}

/** Place each item into the currently shortest column. */
function packShortestColumn(
  heights: number[],
  columnCount: number,
  gap: number,
): number[][] {
  const columns: number[][] = Array.from({ length: columnCount }, () => []);
  const colHeights = Array.from({ length: columnCount }, () => 0);

  heights.forEach((height, index) => {
    let shortest = 0;
    for (let c = 1; c < columnCount; c++) {
      if (colHeights[c] < colHeights[shortest]) shortest = c;
    }
    if (columns[shortest].length > 0) {
      colHeights[shortest] += gap;
    }
    columns[shortest].push(index);
    colHeights[shortest] += height;
  });

  return columns;
}

export function GalleryGrid({
  urls,
  description,
  micros,
  projectTitle,
  projectHref,
  className = "",
}: GalleryGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [columnCount, setColumnCount] = useState(2);
  const [columnWidth, setColumnWidth] = useState(0);
  /** naturalHeight / naturalWidth per url; null = not loaded yet */
  const [ratios, setRatios] = useState<(number | null)[]>(() =>
    urls.map(() => null),
  );

  useEffect(() => {
    setRatios(urls.map(() => null));
  }, [urls]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setColumnCount(mq.matches ? 3 : 2);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const width = el.clientWidth;
      const gaps = GAP * (columnCount - 1);
      setColumnWidth(Math.max(0, (width - gaps) / columnCount));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [columnCount]);

  const heights = useMemo(() => {
    if (columnWidth <= 0) {
      return urls.map(() => 0);
    }
    return urls.map((url, index) => {
      if (isColorPlaceholder(url)) return PLACEHOLDER_HEIGHT;
      const ratio = ratios[index] ?? DEFAULT_RATIO;
      return ratio * columnWidth;
    });
  }, [urls, ratios, columnWidth]);

  const columns = useMemo(
    () => packShortestColumn(heights, columnCount, GAP),
    [heights, columnCount],
  );

  if (urls.length === 0) return null;

  return (
    <>
      <div ref={containerRef}>
        <Stagger
          className={`flex items-start gap-16 ${className}`}
          itemClassName="min-w-0 flex-1"
        >
          {columns.map((column, columnIndex) => (
            <div key={columnIndex} className="flex flex-col gap-16">
              {column.map((index) => {
                const url = urls[index];
                return (
                  <button
                    key={`${url}-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className="block w-full cursor-pointer overflow-hidden rounded-lg text-start transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shockingly-green"
                    aria-label={`باز کردن تصویر ${index + 1}`}
                  >
                    {isColorPlaceholder(url) ? (
                      <div
                        className="min-h-40 w-full rounded-lg"
                        style={{ background: url }}
                      />
                    ) : (
                      <Image
                        src={url}
                        alt=""
                        width={1200}
                        height={800}
                        className="h-auto w-full rounded-lg"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        onLoad={(e) => {
                          const img = e.currentTarget;
                          if (img.naturalWidth <= 0) return;
                          const nextRatio =
                            img.naturalHeight / img.naturalWidth;
                          setRatios((prev) => {
                            if (prev[index] === nextRatio) return prev;
                            const copy = [...prev];
                            copy[index] = nextRatio;
                            return copy;
                          });
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </Stagger>
      </div>

      <GalleryLightbox
        open={activeIndex !== null}
        urls={urls}
        index={activeIndex ?? 0}
        onClose={() => setActiveIndex(null)}
        onIndexChange={setActiveIndex}
        description={description}
        micros={micros}
        projectTitle={projectTitle}
        projectHref={projectHref}
      />
    </>
  );
}
