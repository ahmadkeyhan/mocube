import Link from "next/link";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
};

export function AdminPageHeader({
  title,
  description,
  actionHref,
  actionLabel,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-16">
      <div>
        <h1 className="text-heading-sm tracking-heading-sm text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="mt-8 text-body-sm text-surface-50">{description}</p>
        ) : null}
      </div>

      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="rounded-full bg-shockingly-green px-20 py-10 text-body-sm font-bold text-background"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
