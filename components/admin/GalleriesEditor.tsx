"use client";

import { useState } from "react";
import type { Option } from "@/components/admin/FormControls";
import { MultiImageUploader } from "@/components/admin/ImageUploader";

export type GalleryDefault = {
  urls: string[];
  microServiceIds: string[];
  description?: string;
};

type GalleryRow = {
  key: string;
  urls: string[];
  description: string;
  microServiceIds: string[];
};

const controlClasses =
  "w-full rounded-lg border border-surface-25 bg-off-background px-12 py-10 text-body-sm text-foreground outline-none transition-colors placeholder:text-surface-50 focus:border-shockingly-green";

function toRow(gallery: GalleryDefault | undefined, index: number): GalleryRow {
  return {
    key: `gallery-${index}-${Math.random().toString(36).slice(2, 8)}`,
    urls: gallery?.urls ?? [],
    description: gallery?.description ?? "",
    microServiceIds: gallery?.microServiceIds ?? [],
  };
}

export function GalleriesEditor({
  microServiceOptions,
  defaultGalleries = [],
}: {
  microServiceOptions: Option[];
  defaultGalleries?: GalleryDefault[];
}) {
  const [rows, setRows] = useState<GalleryRow[]>(() =>
    defaultGalleries.length > 0
      ? defaultGalleries.map(toRow)
      : [toRow(undefined, 0)],
  );

  function update(index: number, patch: Partial<GalleryRow>) {
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  }

  function toggleMicro(index: number, value: string, checked: boolean) {
    setRows((current) =>
      current.map((row, i) => {
        if (i !== index) return row;
        const next = checked
          ? [...row.microServiceIds, value]
          : row.microServiceIds.filter((id) => id !== value);
        return { ...row, microServiceIds: next };
      }),
    );
  }

  return (
    <div className="flex flex-col gap-16">
      <input type="hidden" name="gallery-count" value={rows.length} readOnly />

      {rows.map((row, index) => (
        <div
          key={row.key}
          className="card-chrome flex flex-col gap-12 rounded-lg p-16"
        >
          <div className="flex items-center justify-between">
            <span className="text-caption text-surface-50">
              گالری {index + 1}
            </span>
            <button
              type="button"
              onClick={() =>
                setRows((current) => current.filter((_, i) => i !== index))
              }
              className="text-caption text-lipstick-pink"
            >
              حذف گالری
            </button>
          </div>

          <MultiImageUploader
            name={`gallery-urls-${index}`}
            urls={row.urls}
            onChange={(urls) => update(index, { urls })}
          />

          <input
            name={`gallery-description-${index}`}
            value={row.description}
            onChange={(event) =>
              update(index, { description: event.target.value })
            }
            placeholder="توضیح گالری (اختیاری)"
            className={controlClasses}
          />

          <div className="flex flex-wrap gap-8">
            {microServiceOptions.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-6 rounded-full border border-surface-25 px-12 py-6 text-caption text-foreground has-[:checked]:border-shockingly-green has-[:checked]:text-shockingly-green"
              >
                <input
                  type="checkbox"
                  name={`gallery-micro-${index}`}
                  value={option.value}
                  checked={row.microServiceIds.includes(option.value)}
                  onChange={(event) =>
                    toggleMicro(index, option.value, event.target.checked)
                  }
                  className="size-12 accent-shockingly-green"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          setRows((current) => [...current, toRow(undefined, current.length)])
        }
        className="self-start rounded-full border border-surface-25 px-16 py-8 text-caption text-foreground transition-colors hover:border-shockingly-green"
      >
        افزودن گالری
      </button>
    </div>
  );
}
