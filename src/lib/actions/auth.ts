"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";
import {
  sendWelcomeEmail,
  sendPasswordResetEmail,
} from "@/lib/email/order-notifications";

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
};

export async function registerAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const raw = {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    password: String(formData.get("password") || ""),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  const email = parsed.data.email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "Já existe uma conta com este e-mail." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      phone: parsed.data.phone || null,
      passwordHash,
      role: "CUSTOMER",
    },
  });

  sendWelcomeEmail(email, parsed.data.name).catch((err) =>
    console.error("Falha ao enviar e-mail de boas-vindas", err),
  );

  await signIn("credentials", {
    email,
    password: parsed.data.password,
    redirectTo: "/conta",
  });

  return {};
}

export async function loginAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const callbackUrl = String(formData.get("callbackUrl") || "/conta");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "type" in err) {
      return { error: "E-mail ou senha inválidos." };
    }
    throw err;
  }

  return {};
}

export async function requestPasswordResetAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") || "").toLowerCase().trim();

  const user = await prisma.user.findUnique({ where: { email } });
  // Always return success to avoid leaking which e-mails are registered.
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt },
    });

    sendPasswordResetEmail(user.email, user.name, token).catch((err) =>
      console.error("Falha ao enviar e-mail de redefinição de senha", err),
    );
  }

  return { success: true };
}

export async function resetPasswordAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const token = String(formData.get("token") || "");
  const password = String(formData.get("password") || "");

  if (password.length < 6) {
    return { error: "A senha deve ter ao menos 6 caracteres." };
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken || resetToken.expiresAt < new Date()) {
    return { error: "Link inválido ou expirado. Solicite uma nova redefinição." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.deleteMany({
      where: { userId: resetToken.userId },
    }),
  ]);

  return { success: true };
}

export async function adminLoginAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user || user.role !== "ADMIN") {
    return { error: "Credenciais inválidas ou usuário sem permissão de administrador." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin",
    });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "type" in err) {
      return { error: "E-mail ou senha inválidos." };
    }
    throw err;
  }

  return {};
}
