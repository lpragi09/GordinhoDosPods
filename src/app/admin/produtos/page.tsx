import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/actions/admin/guard";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteProductAction } from "@/lib/actions/admin/products";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <AdminShell current="/admin/produtos">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Novo produto
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Produto</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Estoque</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  Nenhum produto cadastrado ainda.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{p.name}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {p.category?.name || "-"}
                  </td>
                  <td className="px-4 py-3">{formatCurrency(p.priceCents)}</td>
                  <td className="px-4 py-3">
                    <span className={p.stock <= 5 ? "font-semibold text-amber-600" : ""}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        p.active
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {p.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/admin/produtos/${p.id}/editar`}
                        className="font-medium text-slate-700 hover:underline"
                      >
                        Editar
                      </Link>
                      <DeleteButton
                        action={deleteProductAction.bind(null, p.id)}
                        confirmMessage="Excluir este produto?"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
