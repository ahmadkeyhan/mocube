import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CustomerForm } from "@/components/admin/forms/CustomerForm";
import { updateCustomer } from "@/lib/admin/actions/customers";
import { getCustomerById } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ویرایش مشتری",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCustomerPage({ params }: PageProps) {
  await requireAdmin();

  const { id } = await params;
  const customer = await getCustomerById(id);
  if (!customer) notFound();

  return (
    <div className="flex max-w-[720px] flex-col gap-24">
      <AdminPageHeader title="ویرایش مشتری" description={customer.name} />
      <CustomerForm action={updateCustomer} defaults={customer} />
    </div>
  );
}
