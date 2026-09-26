import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/actions/admin/guard";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <AdminShell current="/admin/produtos">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Novo produto</h1>
      <ProductForm categories={categories} />
    </AdminShell>
  );
}
