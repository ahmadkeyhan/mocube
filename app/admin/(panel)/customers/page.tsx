import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { SurfaceCard } from "@/components/SurfaceCard";
import { deleteCustomer } from "@/lib/admin/actions/customers";
import { requireAdmin } from "@/lib/auth/guards";
import { getCustomers } from "@/lib/queries/customers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "مشتریان",
};

export default async function AdminCustomersPage() {
  await requireAdmin();
  const customers = await getCustomers();

  return (
    <div className="flex flex-col gap-24">
      <AdminPageHeader
        title="مشتریان"
        description="فهرست مشتریان سایت"
        actionHref="/admin/customers/new"
        actionLabel="مشتری جدید"
      />

      <div className="flex flex-col gap-12">
        {customers.length === 0 ? (
          <SurfaceCard variant="empty">هنوز مشتری‌ای ثبت نشده است.</SurfaceCard>
        ) : null}

        {customers.map((customer) => (
          <SurfaceCard key={customer._id} variant="row">
            <div className="min-w-0">
              <p className="text-body-sm font-bold text-foreground">
                {customer.name}
              </p>
              <p dir="ltr" className="mt-6 text-caption text-surface-50">
                {customer.slug}
              </p>
            </div>

            <div className="flex items-center gap-12">
              <Link
                href={`/admin/customers/${customer._id}`}
                className="rounded-full border border-surface-25 px-16 py-8 text-caption text-foreground transition-colors hover:border-shockingly-green"
              >
                ویرایش
              </Link>
              <DeleteButton action={deleteCustomer} id={customer._id} />
            </div>
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}
