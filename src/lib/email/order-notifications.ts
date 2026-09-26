import { prisma } from "@/lib/prisma";
import { getBranding } from "@/lib/settings";
import { sendMail } from "@/lib/email/mailer";
import {
  orderConfirmationEmail,
  orderStatusUpdateEmail,
  welcomeEmail,
  passwordResetEmail,
  type OrderEmailData,
} from "@/lib/email/templates";

async function loadOrderEmailData(orderId: string): Promise<{
  data: OrderEmailData;
  userEmail: string;
} | null> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, user: true },
  });
  if (!order) return null;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return {
    userEmail: order.user.email,
    data: {
      code: order.code,
      totalCents: order.totalCents,
      shippingCents: order.shippingCents,
      discountCents: order.discountCents,
      items: order.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        priceCents: i.priceCents,
      })),
      shipRecipient: order.shipRecipient,
      shipStreet: order.shipStreet,
      shipNumber: order.shipNumber,
      shipComplement: order.shipComplement,
      shipNeighborhood: order.shipNeighborhood,
      shipCity: order.shipCity,
      shipState: order.shipState,
      shipCep: order.shipCep,
      status: order.status,
      orderUrl: `${baseUrl}/conta/pedidos/${order.id}`,
    },
  };
}

export async function sendOrderConfirmationEmail(orderId: string) {
  const branding = await getBranding();
  const loaded = await loadOrderEmailData(orderId);
  if (!loaded) return;

  await sendMail({
    to: loaded.userEmail,
    subject: `Pedido ${loaded.data.code} confirmado - ${branding.storeName}`,
    html: orderConfirmationEmail(branding, loaded.data),
  });
}

export async function sendOrderStatusUpdateEmail(orderId: string) {
  const branding = await getBranding();
  const loaded = await loadOrderEmailData(orderId);
  if (!loaded) return;

  await sendMail({
    to: loaded.userEmail,
    subject: `Pedido ${loaded.data.code} - atualização de status - ${branding.storeName}`,
    html: orderStatusUpdateEmail(branding, loaded.data),
  });
}

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  const branding = await getBranding();
  await sendMail({
    to: userEmail,
    subject: `Bem-vindo(a) à ${branding.storeName}!`,
    html: welcomeEmail(branding, userName),
  });
}

export async function sendPasswordResetEmail(
  userEmail: string,
  userName: string,
  token: string,
) {
  const branding = await getBranding();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  await sendMail({
    to: userEmail,
    subject: `Redefinição de senha - ${branding.storeName}`,
    html: passwordResetEmail(
      branding,
      userName,
      `${baseUrl}/conta/redefinir-senha/${token}`,
    ),
  });
}
