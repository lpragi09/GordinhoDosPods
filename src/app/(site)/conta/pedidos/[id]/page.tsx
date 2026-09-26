import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AccountNav } from "@/components/site/account-nav";
import { formatCurrency, formatCep, statusColor, statusLabel } from "@/lib/utils";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const order = await prisma.order.findFirst({
    where: { id, userId: session!.user.id },
    include: {
      items: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Minha conta</h1>

      <div className="flex flex-col gap-8 md:flex-row">
        <div className="md:w-56">
          <AccountNav current="/conta/pedidos" />
        </div>

        <div className="flex-1 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold text-slate-900">
              Pedido {order.code}
            </h2>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(order.status)}`}
            >
              {statusLabel(order.status)}
            </span>
          </div>

          <div className="rounded-lg border border-slate-200 p-5">
            <h3 className="mb-3 font-semibold text-slate-900">Itens</h3>
            <div className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between py-2 text-sm">
                  <span>
                    {item.name} <span className="text-slate-400">x{item.quantity}</span>
                  </span>
                  <span className="font-medium">
                    {formatCurrency(item.priceCents * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-1 border-t border-slate-100 pt-3 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Frete</span>
                <span>{formatCurrency(order.shippingCents)}</span>
              </div>
              {order.discountCents > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>Desconto</span>
                  <span>-{formatCurrency(order.discountCents)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-slate-900">
                <span>Total</span>
                <span>{formatCurrency(order.totalCents)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 p-5">
            <h3 className="mb-3 font-semibold text-slate-900">
              Endereço de entrega
            </h3>
            <p className="text-sm text-slate-600">
              {order.shipRecipient}
              <br />
              {order.shipStreet}, {order.shipNumber}
              {order.shipComplement ? ` - ${order.shipComplement}` : ""}
              <br />
              {order.shipNeighborhood} - {order.shipCity}/{order.shipState}
              <br />
              CEP {formatCep(order.shipCep)}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 p-5">
            <h3 className="mb-3 font-semibold text-slate-900">
              Histórico do pedido
            </h3>
            <ol className="space-y-3 border-l-2 border-slate-200 pl-4">
              {order.statusHistory.map((h) => (
                <li key={h.id} className="relative">
                  <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-slate-900" />
                  <p className="text-sm font-medium text-slate-900">
                    {statusLabel(h.status)}
                  </p>
                  <p className="text-xs text-slate-400">
                    {h.createdAt.toLocaleString("pt-BR")}
                  </p>
                  {h.note && <p className="text-xs text-slate-500">{h.note}</p>}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
