import type { Metadata } from "next";
import Link from "next/link";
import { surfaceCardClass } from "@/components/SurfaceCard";
import { getAdminCounts } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/auth/guards";
import { toPersianDigits } from "@/lib/persian";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "داشبورد مدیریت",
};

export default async function AdminDashboardPage() {
  await requireAdmin();
  const counts = await getAdminCounts();

  const cards = [
    {
      href: "/admin/inquiries",
      label: "درخواست‌های خوانده‌نشده",
      value: counts?.unreadInquiries,
    },
    { href: "/admin/projects", label: "پروژه‌ها", value: counts?.projects },
    { href: "/admin/customers", label: "مشتریان", value: counts?.customers },
    { href: "/admin/services", label: "سرویس‌ها", value: counts?.services },
    {
      href: "/admin/microservices",
      label: "میکروسرویس‌ها",
      value: counts?.microServices,
    },
    {
      href: "/admin/mocalendar/businesses",
      label: "کسب‌وکارهای در انتظار",
      value: counts?.pendingBusinesses,
    },
    {
      href: "/admin/mocalendar/briefs",
      label: "سفارش‌های باز",
      value: counts?.openBriefs,
    },
  ];

  return (
    <div className="flex flex-col gap-24">
      <div>
        <h1 className="text-heading-sm tracking-heading-sm text-foreground">
          داشبورد
        </h1>
        <p className="mt-8 text-body-sm text-surface-50">
          {counts
            ? "محتوای سایت را از این‌جا مدیریت کنید."
            : "اتصال به پایگاه داده برقرار نشد."}
        </p>
      </div>

      <div className="grid gap-16 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={surfaceCardClass("panel")}
          >
            <p className="text-caption text-surface-50">{card.label}</p>
            <p className="mt-8 text-heading-sm tracking-heading-sm text-foreground">
              {toPersianDigits(card.value ?? 0)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
