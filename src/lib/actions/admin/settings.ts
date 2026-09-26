"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { settingsSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/actions/admin/guard";

export type SettingsFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
};

export async function saveSettingsAction(
  _prevState: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdmin();

  const raw = {
    storeName: String(formData.get("storeName") || ""),
    logoUrl: String(formData.get("logoUrl") || ""),
    primaryColor: String(formData.get("primaryColor") || "#0f172a"),
    contactEmail: String(formData.get("contactEmail") || ""),
    contactPhone: String(formData.get("contactPhone") || ""),
    whatsapp: String(formData.get("whatsapp") || ""),
    instagram: String(formData.get("instagram") || ""),
    address: String(formData.get("address") || ""),
    freeShippingCents: formData.get("freeShippingCents") || null,
    flatShippingCents: formData.get("flatShippingCents") || 0,
  };

  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  await prisma.settings.upsert({
    where: { id: 1 },
    update: {
      storeName: parsed.data.storeName,
      logoUrl: parsed.data.logoUrl || null,
      primaryColor: parsed.data.primaryColor,
      contactEmail: parsed.data.contactEmail || null,
      contactPhone: parsed.data.contactPhone || null,
      whatsapp: parsed.data.whatsapp || null,
      instagram: parsed.data.instagram || null,
      address: parsed.data.address || null,
      freeShippingCents: parsed.data.freeShippingCents,
      flatShippingCents: parsed.data.flatShippingCents,
    },
    create: {
      id: 1,
      storeName: parsed.data.storeName,
      logoUrl: parsed.data.logoUrl || null,
      primaryColor: parsed.data.primaryColor,
      contactEmail: parsed.data.contactEmail || null,
      contactPhone: parsed.data.contactPhone || null,
      whatsapp: parsed.data.whatsapp || null,
      instagram: parsed.data.instagram || null,
      address: parsed.data.address || null,
      freeShippingCents: parsed.data.freeShippingCents,
      flatShippingCents: parsed.data.flatShippingCents,
    },
  });

  revalidatePath("/", "layout");
  return { success: true };
}
