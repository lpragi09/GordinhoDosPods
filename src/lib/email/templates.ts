import { formatCurrency, statusLabel } from "@/lib/utils";

export type StoreBranding = {
  storeName: string;
  logoUrl?: string | null;
  primaryColor: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
};

export type OrderEmailItem = {
  name: string;
  quantity: number;
  priceCents: number;
};

export type OrderEmailData = {
  code: string;
  totalCents: number;
  shippingCents: number;
  discountCents: number;
  items: OrderEmailItem[];
  shipRecipient: string;
  shipStreet: string;
  shipNumber: string;
  shipComplement?: string | null;
  shipNeighborhood: string;
  shipCity: string;
  shipState: string;
  shipCep: string;
  status: string;
  orderUrl: string;
};

function baseLayout(branding: StoreBranding, title: string, bodyHtml: string) {
  return `
  <!doctype html>
  <html lang="pt-BR">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${title}</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
              <tr>
                <td style="background-color:${branding.primaryColor};padding:24px 32px;text-align:center;">
                  ${
                    branding.logoUrl
                      ? `<img src="${branding.logoUrl}" alt="${branding.storeName}" height="40" style="height:40px;" />`
                      : `<span style="color:#ffffff;font-size:22px;font-weight:bold;">${branding.storeName}</span>`
                  }
                </td>
              </tr>
              <tr>
                <td style="padding:32px;color:#18181b;font-size:15px;line-height:1.6;">
                  ${bodyHtml}
                </td>
              </tr>
              <tr>
                <td style="padding:20px 32px;background-color:#f4f4f5;color:#71717a;font-size:12px;text-align:center;">
                  ${branding.storeName}${
                    branding.contactEmail ? ` · ${branding.contactEmail}` : ""
                  }${branding.contactPhone ? ` · ${branding.contactPhone}` : ""}
                  <br/>Este é um e-mail automático, não é necessário responder.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;
}

function itemsTable(items: OrderEmailItem[]) {
  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #e4e4e7;">${item.name} <span style="color:#71717a;">x${item.quantity}</span></td>
        <td style="padding:8px 0;border-bottom:1px solid #e4e4e7;text-align:right;">${formatCurrency(item.priceCents * item.quantity)}</td>
      </tr>`,
    )
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">${rows}</table>`;
}

export function welcomeEmail(branding: StoreBranding, name: string) {
  const body = `
    <h1 style="font-size:20px;margin:0 0 16px;">Bem-vindo(a), ${name}!</h1>
    <p>Sua conta na <strong>${branding.storeName}</strong> foi criada com sucesso. Agora você já pode acompanhar seus pedidos e finalizar compras com muito mais agilidade.</p>
  `;
  return baseLayout(branding, `Bem-vindo(a) à ${branding.storeName}`, body);
}

export function passwordResetEmail(
  branding: StoreBranding,
  name: string,
  resetUrl: string,
) {
  const body = `
    <h1 style="font-size:20px;margin:0 0 16px;">Redefinição de senha</h1>
    <p>Olá, ${name}. Recebemos uma solicitação para redefinir a senha da sua conta na <strong>${branding.storeName}</strong>.</p>
    <p style="margin:16px 0;">
      <a href="${resetUrl}" style="display:inline-block;background-color:${branding.primaryColor};color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:6px;font-weight:bold;">Redefinir senha</a>
    </p>
    <p style="color:#71717a;font-size:13px;">Este link expira em 1 hora. Se você não solicitou essa alteração, ignore este e-mail.</p>
  `;
  return baseLayout(branding, "Redefinição de senha", body);
}

export function orderConfirmationEmail(
  branding: StoreBranding,
  order: OrderEmailData,
) {
  const body = `
    <h1 style="font-size:20px;margin:0 0 8px;">Pedido confirmado! 🎉</h1>
    <p style="margin:0 0 16px;">Recebemos seu pedido <strong>${order.code}</strong> e ele já está sendo processado.</p>

    ${itemsTable(order.items)}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;">
      <tr><td style="padding:4px 0;color:#71717a;">Frete</td><td style="padding:4px 0;text-align:right;">${formatCurrency(order.shippingCents)}</td></tr>
      ${
        order.discountCents > 0
          ? `<tr><td style="padding:4px 0;color:#71717a;">Desconto</td><td style="padding:4px 0;text-align:right;">-${formatCurrency(order.discountCents)}</td></tr>`
          : ""
      }
      <tr><td style="padding:8px 0;font-weight:bold;border-top:1px solid #e4e4e7;">Total</td><td style="padding:8px 0;text-align:right;font-weight:bold;border-top:1px solid #e4e4e7;">${formatCurrency(order.totalCents)}</td></tr>
    </table>

    <h2 style="font-size:15px;margin:0 0 8px;">Endereço de entrega</h2>
    <p style="margin:0 0 24px;color:#3f3f46;">
      ${order.shipRecipient}<br/>
      ${order.shipStreet}, ${order.shipNumber}${order.shipComplement ? ` - ${order.shipComplement}` : ""}<br/>
      ${order.shipNeighborhood} - ${order.shipCity}/${order.shipState}<br/>
      CEP ${order.shipCep}
    </p>

    <a href="${order.orderUrl}" style="display:inline-block;background-color:${branding.primaryColor};color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:6px;font-weight:bold;">Acompanhar pedido</a>
  `;
  return baseLayout(branding, `Pedido ${order.code} confirmado`, body);
}

export function orderStatusUpdateEmail(
  branding: StoreBranding,
  order: OrderEmailData,
) {
  const body = `
    <h1 style="font-size:20px;margin:0 0 8px;">Atualização do seu pedido</h1>
    <p style="margin:0 0 16px;">O pedido <strong>${order.code}</strong> teve seu status atualizado para:</p>
    <p style="margin:0 0 24px;">
      <span style="display:inline-block;background-color:${branding.primaryColor};color:#ffffff;padding:6px 14px;border-radius:999px;font-weight:bold;font-size:13px;">${statusLabel(order.status)}</span>
    </p>
    <a href="${order.orderUrl}" style="display:inline-block;background-color:${branding.primaryColor};color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:6px;font-weight:bold;">Ver detalhes do pedido</a>
  `;
  return baseLayout(branding, `Pedido ${order.code}: ${statusLabel(order.status)}`, body);
}
