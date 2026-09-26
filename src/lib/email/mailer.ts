import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.SMTP_HOST) {
    console.warn(
      "[mailer] SMTP_HOST não configurado — e-mails serão apenas logados no console.",
    );
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  });

  return transporter;
}

export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
}) {
  const t = getTransporter();
  const from = process.env.SMTP_FROM || "NovaLoja <naoresponda@novaloja.com.br>";

  if (!t) {
    console.log("----- EMAIL (modo simulação, sem SMTP configurado) -----");
    console.log("Para:", options.to);
    console.log("Assunto:", options.subject);
    console.log("----------------------------------------------------------");
    return;
  }

  await t.sendMail({
    from,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
}
