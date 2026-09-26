import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPaymentClient, isMercadoPagoConfigured } from "@/lib/mercadopago";
import { sendOrderStatusUpdateEmail } from "@/lib/email/order-notifications";
import type { OrderStatus } from "@prisma/client";

function mapPaymentStatus(mpStatus: string): OrderStatus | null {
  switch (mpStatus) {
    case "approved":
      return "PAID";
    case "pending":
    case "in_process":
    case "authorized":
      return "PENDING";
    case "rejected":
    case "cancelled":
      return "CANCELED";
    case "refunded":
    case "charged_back":
      return "REFUNDED";
    default:
      return null;
  }
}

export async function POST(req: NextRequest) {
  if (!isMercadoPagoConfigured()) {
    return NextResponse.json({ ok: true });
  }

  const url = req.nextUrl;
  let paymentId =
    url.searchParams.get("data.id") || url.searchParams.get("id") || null;
  const type = url.searchParams.get("type") || url.searchParams.get("topic");

  if (!paymentId) {
    try {
      const body = await req.json();
      paymentId = body?.data?.id ? String(body.data.id) : null;
    } catch {
      // no JSON body, ignore
    }
  }

  if (!paymentId || (type && type !== "payment")) {
    return NextResponse.json({ ok: true });
  }

  try {
    const payment = await getPaymentClient().get({ id: paymentId });
    const orderId = payment.external_reference;
    if (!orderId) return NextResponse.json({ ok: true });

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ ok: true });

    const newStatus = mapPaymentStatus(payment.status || "");
    if (!newStatus || newStatus === order.status) {
      return NextResponse.json({ ok: true });
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: newStatus,
          mpPaymentId: String(payment.id),
          paymentMethod: payment.payment_type_id || undefined,
          paidAt: newStatus === "PAID" ? new Date() : order.paidAt,
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: newStatus,
          note: "Atualizado automaticamente pelo Mercado Pago",
        },
      });

      if (newStatus === "PAID" && order.status !== "PAID") {
        const items = await tx.orderItem.findMany({
          where: { orderId: order.id },
        });
        for (const item of items) {
          if (!item.productId) continue;
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }
    });

    sendOrderStatusUpdateEmail(order.id).catch((err) =>
      console.error("Falha ao enviar e-mail de atualização de status", err),
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro ao processar webhook do Mercado Pago", err);
    return NextResponse.json({ ok: true });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
