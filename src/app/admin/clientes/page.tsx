import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/actions/admin/guard";
import { prisma } from "@/lib/prisma";

export default async function AdminCustomersPage() {
  await requireAdmin();
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <AdminShell current="/admin/clientes">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Clientes</h1>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Telefone</th>
              <th className="px-4 py-3">Pedidos</th>
              <th className="px-4 py-3">Desde</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  Nenhum cliente cadastrado ainda.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{c.name}</td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="px-4 py-3">{c.phone || "-"}</td>
                  <td className="px-4 py-3">{c._count.orders}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {c.createdAt.toLocaleDateString("pt-BR")}
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
