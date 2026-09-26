"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { computeShippingCents } from "@/lib/shipping";
import { generateOrderCode } from "@/lib/utils";
import { isMercadoPagoConfigured, getPreferenceClient } from "@/lib/mercadopago";
import { sendOrderConfirmationEmail } from "@/lib/email/order-notifications";

type CheckoutItem = { productId: string; quantity: number };

export type CheckoutResult =
  | { error: string }
  | { redirectUrl: string; orderId: string };

export async function createOrderAction(input: {
  addressId: string;
  couponCode?: string;
  items: CheckoutItem[];
}): Promise<CheckoutResult> {
  const session = await auth();
  if (!session?.user) {
    return { error: "Você precisa estar logado para finalizar a compra." };
  }

  if (!input.items?.length) {
    return { error: "Seu carrinho está vazio." };
  }

  if (!isMercadoPagoConfigured()) {
    return {
      error:
        "Pagamentos ainda não configurados pela loja. Peça ao administrador para cadastrar as credenciais do Mercado Pago no painel.",
    };
  }

  const address = await prisma.address.findFirst({
    where: { id: input.addressId, userId: session.user.id },
  });
  if (!address) {
    return { error: "Endereço inválido." };
  }

  const productIds = input.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
  });

  const orderItemsData: {
    productId: string;
    name: string;
    imageUrl: string | null;
    priceCents: number;
    quantity: number;
  }[] = [];

  for (const cartItem of input.items) {
    const product = products.find((p) => p.id === cartItem.productId);
    if (!product) {
      return { error: `Um dos produtos do carrinho não está mais disponível.` };
    }
    if (product.stock < cartItem.quantity) {
      return {
        error: `Estoque insuficiente para "${product.name}" (disponível: ${product.stock}).`,
      };
    }
    orderItemsData.push({
      productId: product.id,
      name: product.name,
      imageUrl: product.images[0] || null,
      priceCents: product.priceCents,
      quantity: cartItem.quantity,
    });
  }

  const itemsCents = orderItemsData.reduce(
    (sum, i) => sum + i.priceCents * i.quantity,
    0,
  );

  const settings = await getSettings();

  let discountCents = 0;
  let couponId: string | null = null;

  if (input.couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: input.couponCode.toUpperCase().trim() },
    });
    if (
      coupon &&
      coupon.active &&
      (!coupon.expiresAt || coupon.expiresAt > new Date()) &&
      (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) &&
      (!coupon.minOrderCents || itemsCents >= coupon.minOrderCents)
    ) {
      couponId = coupon.id;
      if (coupon.percentOff) {
        discountCents = Math.round((itemsCents * coupon.percentOff) / 100);
      } else if (coupon.amountOffCents) {
        discountCents = Math.min(coupon.amountOffCents, itemsCents);
      }
    }
  }

  const shippingCents = computeShippingCents(itemsCents, settings);
  const totalCents = Math.max(0, itemsCents + shippingCents - discountCents);

  const order = await prisma.order.create({
    data: {
      code: generateOrderCode(),
      userId: session.user.id,
      addressId: address.id,
      couponId,
      shipRecipient: address.recipient,
      shipCep: address.cep,
      shipStreet: address.street,
      shipNumber: address.number,
      shipComplement: address.complement,
      shipNeighborhood: address.neighborhood,
      shipCity: address.city,
      shipState: address.state,
      itemsCents,
      shippingCents,
      discountCents,
      totalCents,
      status: "PENDING",
      items: { create: orderItemsData },
      statusHistory: { create: { status: "PENDING", note: "Pedido criado" } },
    },
  });

  if (couponId) {
    await prisma.coupon.update({
      where: { id: couponId },
      data: { usedCount: { increment: 1 } },
    });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const preferenceClient = getPreferenceClient();
    const preference = await preferenceClient.create({
      body: {
        external_reference: order.id,
        items: orderItemsData.map((item) => ({
          id: item.productId,
          title: item.name,
          quantity: item.quantity,
          unit_price: item.priceCents / 100,
          currency_id: "BRL",
        })),
        shipments: {
          cost: shippingCents / 100,
          mode: "not_specified",
        },
        payer: {
          name: session.user.name || undefined,
          email: session.user.email || undefined,
        },
        back_urls: {
          success: `${baseUrl}/checkout/sucesso?order=${order.id}`,
          failure: `${baseUrl}/checkout/falha?order=${order.id}`,
          pending: `${baseUrl}/checkout/pendente?order=${order.id}`,
        },
        auto_return: "approved",
        notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { mpPreferenceId: preference.id },
    });

    sendOrderConfirmationEmail(order.id).catch((err) =>
      console.error("Falha ao enviar e-mail de confirmação do pedido", err),
    );

    return {
      redirectUrl: preference.init_point || preference.sandbox_init_point || "",
      orderId: order.id,
    };
  } catch (err) {
    console.error("Erro ao criar preferência do Mercado Pago", err);
    return {
      error:
        "Não foi possível iniciar o pagamento. Tente novamente em instantes.",
    };
  }
}
