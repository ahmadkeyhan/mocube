import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CustomerForm } from "@/components/admin/forms/CustomerForm";
import { createCustomer } from "@/lib/admin/actions/customers";
import { requireAdmin } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "مشتری جدید",
};

export default async function NewCustomerPage() {
  await requireAdmin();

  return (
    <div className="flex max-w-[720px] flex-col gap-24">
      <AdminPageHeader title="مشتری جدید" />
      <CustomerForm action={createCustomer} />
    </div>
  );
}
