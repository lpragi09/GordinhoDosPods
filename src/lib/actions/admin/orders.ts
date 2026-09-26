"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/actions/admin/guard";
import { sendOrderStatusUpdateEmail } from "@/lib/email/order-notifications";
import type { OrderStatus } from "@prisma/client";

export type OrderActionState = {
  error?: string;
  success?: boolean;
};

const VALID_STATUSES: OrderStatus[] = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELED",
  "REFUNDED",
];

export async function updateOrderStatusAction(
  _prevState: OrderActionState,
  formData: FormData,
): Promise<OrderActionState> {
  await requireAdmin();

  const orderId = String(formData.get("orderId") || "");
  const status = String(formData.get("status") || "") as OrderStatus;
  const note = String(formData.get("note") || "");

  if (!VALID_STATUSES.includes(status)) {
    return { error: "Status inválido." };
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return { error: "Pedido não encontrado." };
  }

  if (order.status !== status) {
    await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: {
          status,
          paidAt: status === "PAID" && !order.paidAt ? new Date() : order.paidAt,
        },
      }),
      prisma.orderStatusHistory.create({
        data: { orderId, status, note: note || undefined },
      }),
    ]);

    sendOrderStatusUpdateEmail(orderId).catch((err) =>
      console.error("Falha ao enviar e-mail de atualização de status", err),
    );
  }

  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath("/admin/pedidos");
  revalidatePath(`/conta/pedidos/${orderId}`);

  return { success: true };
}
