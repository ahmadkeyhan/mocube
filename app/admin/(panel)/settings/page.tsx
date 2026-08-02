import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SiteSettingsForm } from "@/components/admin/forms/SiteSettingsForm";
import { requireAdmin } from "@/lib/auth/guards";
import { getSiteSettings } from "@/lib/queries/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "تنظیمات سایت",
};

type PageProps = {
  searchParams: Promise<{ saved?: string }>;
};

export default async function AdminSettingsPage({ searchParams }: PageProps) {
  await requireAdmin();

  const [settings, { saved }] = await Promise.all([
    getSiteSettings(),
    searchParams,
  ]);

  return (
    <div className="flex max-w-[720px] flex-col gap-24">
      <AdminPageHeader
        title="تنظیمات سایت"
        description="اطلاعات تماس و بنر اعلان"
      />

      {saved ? (
        <p className="rounded-lg border border-shockingly-green/50 bg-shockingly-green/10 px-12 py-10 text-body-sm text-shockingly-green">
          تنظیمات ذخیره شد.
        </p>
      ) : null}

      <SiteSettingsForm defaults={settings} />
    </div>
  );
}
