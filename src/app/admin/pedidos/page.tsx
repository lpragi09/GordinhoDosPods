import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/actions/admin/guard";
import { prisma } from "@/lib/prisma";
import { formatCurrency, statusColor, statusLabel } from "@/lib/utils";
import type { OrderStatus } from "@prisma/client";

const STATUSES: OrderStatus[] = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELED",
  "REFUNDED",
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();
  const { status } = await searchParams;

  const orders = await prisma.order.findMany({
    where: status ? { status: status as OrderStatus } : undefined,
    orderBy: { createdAt: "desc" },
    include: { user: true, items: true },
  });

  return (
    <AdminShell current="/admin/pedidos">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Pedidos</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href="/admin/pedidos"
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
            !status ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          Todos
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/pedidos?status=${s}`}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              status === s ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {statusLabel(s)}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Pedido</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Itens</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  Nenhum pedido encontrado.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="cursor-pointer hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <Link href={`/admin/pedidos/${order.id}`}>{order.code}</Link>
                  </td>
                  <td className="px-4 py-3">
                    {order.user.name}
                    <br />
                    <span className="text-xs text-slate-400">{order.user.email}</span>
                  </td>
                  <td className="px-4 py-3">{order.items.length}</td>
                  <td className="px-4 py-3 font-semibold">
                    {formatCurrency(order.totalCents)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor(order.status)}`}>
                      {statusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {order.createdAt.toLocaleString("pt-BR")}
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
