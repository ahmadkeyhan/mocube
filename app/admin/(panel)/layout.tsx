import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { logoutAction } from "@/lib/admin/actions/auth";
import { requireAdmin } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await requireAdmin();

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-24 px-16 py-24 lg:flex-row md:px-24">
      <aside className="flex shrink-0 flex-col gap-24 lg:w-[220px]">
        <div className="flex items-center justify-between gap-12">
          <Link
            href="/"
            className="text-body-sm font-bold text-shockingly-green"
          >
            موکیوب
          </Link>
          <span className="text-caption text-surface-50">{user.name}</span>
        </div>

        <AdminNav />

        <form action={logoutAction} className="lg:mt-auto">
          <button
            type="submit"
            className="w-full rounded-full bg-off-background px-16 py-10 text-caption text-foreground transition-colors hover:border-lipstick-pink hover:text-lipstick-pink"
          >
            خروج
          </button>
        </form>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
