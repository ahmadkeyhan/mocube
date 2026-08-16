"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { MdClose, MdOutlineFilterList, MdRocket } from "react-icons/md";
import { microHash } from "@/lib/micro-label";
import type { ServiceColor } from "@/lib/models/types";
import {
  serviceBgTintClass,
  serviceBorderClass,
} from "@/lib/service-colors";

export type FilterOption = { slug: string; name: string };

export type MicroFilterOption = FilterOption & { color: ServiceColor };

export type ProjectsFilterValue = {
  service: string | null;
  customer: string | null;
  micro: string | null;
};

type ProjectsFilterProps = {
  services: FilterOption[];
  customers: FilterOption[];
  microServices: MicroFilterOption[];
  value: ProjectsFilterValue;
  onServiceChange: (slug: string) => void;
  onCustomerChange: (slug: string) => void;
  onMicroChange: (slug: string) => void;
  onClear: () => void;
};

function FilterSelect({
  label,
  value,
  onChange,
  emptyLabel,
  options,
  leading,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  emptyLabel: string;
  options: FilterOption[];
  leading?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selectedLabel =
    options.find((item) => item.slug === value)?.name ?? emptyLabel;

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const pick = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className={`relative inline-flex ${open ? "z-30" : "z-0"}`}
    >
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        className="relative inline-flex min-w-[10rem] items-center justify-between gap-12 rounded-full border border-surface-25 bg-off-background py-8 pr-12 pl-24 text-body-sm text-foreground outline-none transition-colors hover:border-surface-50"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="flex min-w-0 items-center gap-1">
          {leading}
          <span className="truncate">{selectedLabel}</span>
        </span>
        <svg
          aria-hidden
          viewBox="0 0 12 8"
          className={`pointer-events-none absolute top-1/2 left-12 size-12 -translate-y-1/2 text-surface-50 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={label}
          className="absolute top-[calc(100%+6px)] right-0 z-30 max-h-60 min-w-full overflow-auto rounded-lg border border-surface-25 bg-off-background py-4 shadow-lg"
        >
          <li role="option" aria-selected={value === ""}>
            <button
              type="button"
              className={`w-full px-16 py-8 text-start text-body-sm transition-colors hover:bg-surface-25/40 ${
                value === ""
                  ? "text-foreground"
                  : "text-surface-50 hover:text-foreground"
              }`}
              onMouseDown={(event) => {
                event.preventDefault();
                pick("");
              }}
            >
              <span className="inline-flex items-center gap-1">
                {leading}
                {emptyLabel}
              </span>
            </button>
          </li>
          {options.map((item) => {
            const active = value === item.slug;
            return (
              <li key={item.slug} role="option" aria-selected={active}>
                <button
                  type="button"
                  className={`w-full px-16 py-8 text-start text-body-sm transition-colors hover:bg-surface-25/40 ${
                    active
                      ? "text-foreground"
                      : "text-surface-50 hover:text-foreground"
                  }`}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    pick(item.slug);
                  }}
                >
                  <span className="inline-flex items-center gap-1">
                    {leading}
                    {item.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export function ProjectsFilter({
  services,
  customers,
  microServices,
  value,
  onServiceChange,
  onCustomerChange,
  onMicroChange,
  onClear,
}: ProjectsFilterProps) {
  const [open, setOpen] = useState(false);
  const [panelOverflow, setPanelOverflow] = useState<"hidden" | "visible">(
    "hidden",
  );
  const panelId = useId();
  const reduceMotion = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  const microChipClass = (color: ServiceColor, active: boolean) =>
    `rounded-full border px-2 py-1 text-caption transition-colors ${serviceBorderClass[color]} ${
      active
        ? `${serviceBgTintClass[color]} text-foreground`
        : "bg-transparent text-surface-50 hover:text-foreground"
    }`;

  const filterActive = Boolean(value.service || value.customer || value.micro);

  return (
    <div className="mt-12 flex flex-col gap-16">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="فیلتر"
          aria-expanded={open}
          aria-controls={panelId}
          className="relative inline-flex h-40 items-center justify-center gap-2 rounded-full border border-surface-25 bg-off-background px-4 text-foreground transition-colors hover:border-surface-50"
          onClick={() => setOpen((current) => !current)}
        >
          {open ? (
            <MdClose aria-hidden className="size-20" />
          ) : (
            <MdOutlineFilterList aria-hidden className="size-20" />
          )}
          فیلتر
          {filterActive ? (
            <span
              aria-hidden
              className="absolute top-6 inset-e-6 size-8 rounded-full bg-shockingly-green"
            />
          ) : null}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            key="filter-panel"
            className="flex flex-col gap-16"
            style={{
              overflow: reduceMotion ? "visible" : panelOverflow,
            }}
            initial={
              reduceMotion ? false : { height: 0, opacity: 0, y: -8 }
            }
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={
              reduceMotion
                ? undefined
                : { height: 0, opacity: 0, y: -8 }
            }
            transition={{ duration: 0.32, ease }}
            onAnimationStart={() => {
              if (!reduceMotion) setPanelOverflow("hidden");
            }}
            onAnimationComplete={() => {
              if (open && !reduceMotion) setPanelOverflow("visible");
            }}
          >
            {filterActive ? (
              <button
                type="button"
                onClick={onClear}
                className="w-56 rounded-full border border-red-400 bg-red-400/15 p-2 text-caption text-foreground transition-colors hover:bg-red-400"
              >
                پاک کردن فیلتر
              </button>
            ) : null}
            <div className="flex flex-wrap items-center gap-2">
              <FilterSelect
                label="سرویس"
                emptyLabel="همه سرویس‌ها"
                value={
                  value.service && !value.customer && !value.micro
                    ? value.service
                    : ""
                }
                onChange={onServiceChange}
                options={services}
              />
              <FilterSelect
                label="مشتری"
                emptyLabel="همه مشتریان"
                value={value.customer ?? ""}
                onChange={onCustomerChange}
                options={customers}
                leading={
                  <MdRocket aria-hidden className="size-16 shrink-0" />
                }
              />
            </div>
            <div className="flex max-h-80 flex-wrap gap-2 overflow-y-auto">
              {microServices.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => onMicroChange(item.slug)}
                  className={microChipClass(
                    item.color,
                    value.micro === item.slug,
                  )}
                >
                  {microHash(item.name)}
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
