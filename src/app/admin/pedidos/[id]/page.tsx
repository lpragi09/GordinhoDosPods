import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/actions/admin/guard";
import { prisma } from "@/lib/prisma";
import { formatCep, formatCurrency, statusColor, statusLabel } from "@/lib/utils";
import { OrderStatusForm } from "@/components/admin/order-status-form";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      user: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!order) notFound();

  return (
    <AdminShell current="/admin/pedidos">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Pedido {order.code}</h1>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(order.status)}`}>
          {statusLabel(order.status)}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-3 font-semibold text-slate-900">Itens</h2>
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
                <span>Subtotal</span>
                <span>{formatCurrency(order.itemsCents)}</span>
              </div>
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

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-3 font-semibold text-slate-900">Cliente</h2>
            <p className="text-sm text-slate-600">
              {order.user.name}
              <br />
              {order.user.email}
              {order.user.phone && (
                <>
                  <br />
                  {order.user.phone}
                </>
              )}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-3 font-semibold text-slate-900">Endereço de entrega</h2>
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

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-3 font-semibold text-slate-900">Pagamento</h2>
            <p className="text-sm text-slate-600">
              {order.mpPaymentId ? (
                <>
                  ID Mercado Pago: {order.mpPaymentId}
                  <br />
                  Método: {order.paymentMethod || "-"}
                  <br />
                  {order.paidAt && <>Pago em: {order.paidAt.toLocaleString("pt-BR")}</>}
                </>
              ) : (
                "Pagamento ainda não confirmado."
              )}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-3 font-semibold text-slate-900">Atualizar status</h2>
            <OrderStatusForm orderId={order.id} currentStatus={order.status} />
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="mb-3 font-semibold text-slate-900">Histórico</h2>
            <ol className="space-y-3 border-l-2 border-slate-200 pl-4">
              {order.statusHistory.map((h) => (
                <li key={h.id} className="relative">
                  <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-slate-900" />
                  <p className="text-sm font-medium text-slate-900">{statusLabel(h.status)}</p>
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
    </AdminShell>
  );
}
