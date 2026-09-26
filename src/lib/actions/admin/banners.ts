"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/actions/admin/guard";

export type BannerFormState = {
  error?: string;
};

export async function saveBannerAction(
  _prevState: BannerFormState,
  formData: FormData,
): Promise<BannerFormState> {
  await requireAdmin();

  const imageUrl = String(formData.get("imageUrl") || "");
  if (!imageUrl) {
    return { error: "Informe a URL da imagem do banner." };
  }

  await prisma.banner.create({
    data: {
      imageUrl,
      link: String(formData.get("link") || "") || null,
      title: String(formData.get("title") || "") || null,
      order: Number(formData.get("order") || 0),
      active: true,
    },
  });

  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect("/admin/banners");
}

export async function deleteBannerAction(bannerId: string) {
  await requireAdmin();
  await prisma.banner.delete({ where: { id: bannerId } });
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function toggleBannerAction(bannerId: string, active: boolean) {
  await requireAdmin();
  await prisma.banner.update({ where: { id: bannerId }, data: { active } });
  revalidatePath("/admin/banners");
  revalidatePath("/");
}
