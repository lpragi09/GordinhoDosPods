import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AccountNav } from "@/components/site/account-nav";
import { formatCurrency, statusColor, statusLabel } from "@/lib/utils";

export default async function OrdersPage() {
  const session = await auth();
  const orders = await prisma.order.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Minha conta</h1>

      <div className="flex flex-col gap-8 md:flex-row">
        <div className="md:w-56">
          <AccountNav current="/conta/pedidos" />
        </div>

        <div className="flex-1">
          <h2 className="mb-4 font-semibold text-foreground">Meus pedidos</h2>

          {orders.length === 0 ? (
            <p className="text-muted">Você ainda não fez nenhum pedido.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/conta/pedidos/${order.id}`}
                  className="flex flex-col gap-2 rounded-lg border border-border p-4 hover:border-accent/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-foreground">{order.code}</p>
                    <p className="text-xs text-muted">
                      {order.createdAt.toLocaleDateString("pt-BR")} ·{" "}
                      {order.items.length} item(ns)
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(order.status)}`}
                    >
                      {statusLabel(order.status)}
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(order.totalCents)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
