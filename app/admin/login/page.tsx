import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ADMIN_HOME, auth } from "@/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ورود به پنل مدیریت",
};

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user?.role === "admin") redirect(ADMIN_HOME);

  return (
    <main className="flex flex-1 items-center justify-center px-16 py-64">
      <div className="w-full max-w-[420px] rounded-lg border border-surface-25 bg-off-black p-32">
        <p className="text-caption text-shockingly-green">موکیوب</p>
        <h1 className="mt-8 text-heading-sm tracking-heading-sm text-surface-cream">
          ورود به پنل مدیریت
        </h1>
        <p className="mt-8 mb-24 text-body-sm text-surface-50">
          برای مدیریت محتوای سایت وارد شوید.
        </p>

        <LoginForm />
      </div>
    </main>
  );
}
