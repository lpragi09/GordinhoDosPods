import { prisma } from "@/lib/prisma";

export async function getSettings() {
  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
  return settings;
}

export async function getBranding() {
  const settings = await getSettings();
  return {
    storeName: settings.storeName,
    logoUrl: settings.logoUrl,
    primaryColor: settings.primaryColor,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
  };
}
