"use client";

import { useState } from "react";
import type { PricingPlan } from "@/lib/models/types";

type PlanRow = {
  key: string;
  name: string;
  priceLabel: string;
  features: string;
  highlighted: boolean;
};

const controlClasses =
  "w-full rounded-lg border border-surface-25 bg-off-background px-12 py-10 text-body-sm text-foreground outline-none transition-colors placeholder:text-surface-50 focus:border-shockingly-green";

function toRow(plan: PricingPlan | undefined, index: number): PlanRow {
  return {
    key: `plan-${index}-${Math.random().toString(36).slice(2, 8)}`,
    name: plan?.name ?? "",
    priceLabel: plan?.priceLabel ?? "",
    features: plan?.features.join("\n") ?? "",
    highlighted: plan?.highlighted ?? false,
  };
}

export function PricingPlansEditor({
  defaultPlans = [],
}: {
  defaultPlans?: PricingPlan[];
}) {
  const [rows, setRows] = useState<PlanRow[]>(() =>
    defaultPlans.length > 0 ? defaultPlans.map(toRow) : [toRow(undefined, 0)],
  );

  function update(index: number, patch: Partial<PlanRow>) {
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  }

  return (
    <div className="flex flex-col gap-16">
      <input type="hidden" name="plan-count" value={rows.length} readOnly />

      {rows.map((row, index) => (
        <div
          key={row.key}
          className="card-chrome flex flex-col gap-12 rounded-lg p-16"
        >
          <div className="flex items-center justify-between">
            <span className="text-caption text-surface-50">
              پلن {index + 1}
            </span>
            <button
              type="button"
              onClick={() =>
                setRows((current) => current.filter((_, i) => i !== index))
              }
              className="text-caption text-lipstick-pink"
            >
              حذف پلن
            </button>
          </div>

          <div className="grid gap-12 md:grid-cols-2">
            <input
              name={`plan-name-${index}`}
              value={row.name}
              onChange={(event) => update(index, { name: event.target.value })}
              placeholder="نام پلن"
              className={controlClasses}
            />
            <input
              name={`plan-price-${index}`}
              value={row.priceLabel}
              onChange={(event) =>
                update(index, { priceLabel: event.target.value })
              }
              placeholder="قیمت (مثلاً از ۱۲ میلیون تومان)"
              className={controlClasses}
            />
          </div>

          <textarea
            name={`plan-features-${index}`}
            value={row.features}
            onChange={(event) =>
              update(index, { features: event.target.value })
            }
            rows={4}
            placeholder="هر ویژگی در یک خط"
            className={`${controlClasses} resize-y`}
          />

          <label className="flex cursor-pointer items-center gap-8 text-body-sm text-foreground">
            <input
              type="checkbox"
              name={`plan-highlighted-${index}`}
              checked={row.highlighted}
              onChange={(event) =>
                update(index, { highlighted: event.target.checked })
              }
              className="size-16 accent-shockingly-green"
            />
            پلن شاخص
          </label>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          setRows((current) => [...current, toRow(undefined, current.length)])
        }
        className="self-start rounded-full border border-surface-25 px-16 py-8 text-caption text-foreground transition-colors hover:border-shockingly-green"
      >
        افزودن پلن
      </button>
    </div>
  );
}
