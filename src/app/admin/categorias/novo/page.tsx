import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/actions/admin/guard";
import { CategoryForm } from "@/components/admin/category-form";

export default async function NewCategoryPage() {
  await requireAdmin();

  return (
    <AdminShell current="/admin/categorias">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Nova categoria</h1>
      <CategoryForm />
    </AdminShell>
  );
}
