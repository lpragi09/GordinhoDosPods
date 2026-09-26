import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/actions/admin/guard";
import { prisma } from "@/lib/prisma";
import { formatCurrency, statusColor, statusLabel } from "@/lib/utils";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [
    totalProducts,
    activeProducts,
    lowStock,
    totalOrders,
    pendingOrders,
    totalCustomers,
    revenueAgg,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.product.count({ where: { stock: { lte: 5 }, active: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.aggregate({
      where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } },
      _sum: { totalCents: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: true },
    }),
  ]);

  const stats = [
    { label: "Faturamento (pedidos pagos)", value: formatCurrency(revenueAgg._sum.totalCents || 0) },
    { label: "Total de pedidos", value: totalOrders },
    { label: "Pedidos aguardando pagamento", value: pendingOrders },
    { label: "Clientes cadastrados", value: totalCustomers },
    { label: "Produtos ativos", value: `${activeProducts}/${totalProducts}` },
    { label: "Produtos com estoque baixo", value: lowStock },
  ];

  return (
    <AdminShell current="/admin">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Dashboard</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h2 className="font-semibold text-slate-900">Últimos pedidos</h2>
          <Link href="/admin/pedidos" className="text-sm font-medium text-slate-600 hover:underline">
            Ver todos →
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {recentOrders.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">Nenhum pedido ainda.</p>
          ) : (
            recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/pedidos/${order.id}`}
                className="flex items-center justify-between p-4 text-sm hover:bg-slate-50"
              >
                <div>
                  <p className="font-medium text-slate-900">{order.code}</p>
                  <p className="text-xs text-slate-500">{order.user.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor(order.status)}`}>
                    {statusLabel(order.status)}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(order.totalCents)}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </AdminShell>
  );
}
