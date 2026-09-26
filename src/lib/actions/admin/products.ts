"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/actions/admin/guard";

export type ProductFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function saveProductAction(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const imagesRaw = String(formData.get("images") || "");
  const images = imagesRaw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const raw = {
    name: String(formData.get("name") || ""),
    slug: String(formData.get("slug") || ""),
    description: String(formData.get("description") || ""),
    priceCents: formData.get("priceCents"),
    compareCents: formData.get("compareCents") || null,
    sku: String(formData.get("sku") || ""),
    stock: formData.get("stock"),
    images,
    categoryId: String(formData.get("categoryId") || "") || null,
    active: formData.get("active") === "on",
    featured: formData.get("featured") === "on",
    weightGrams: formData.get("weightGrams") || 0,
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  const productId = formData.get("productId")
    ? String(formData.get("productId"))
    : null;

  const existingSlug = await prisma.product.findFirst({
    where: { slug: parsed.data.slug, NOT: productId ? { id: productId } : undefined },
  });
  if (existingSlug) {
    return { fieldErrors: { slug: "Já existe um produto com esse slug." } };
  }

  const existingSku = await prisma.product.findFirst({
    where: { sku: parsed.data.sku, NOT: productId ? { id: productId } : undefined },
  });
  if (existingSku) {
    return { fieldErrors: { sku: "Já existe um produto com esse SKU." } };
  }

  const data = {
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description,
    priceCents: parsed.data.priceCents,
    compareCents: parsed.data.compareCents || null,
    sku: parsed.data.sku,
    stock: parsed.data.stock,
    images: parsed.data.images,
    categoryId: parsed.data.categoryId,
    active: parsed.data.active,
    featured: parsed.data.featured,
    weightGrams: parsed.data.weightGrams,
  };

  if (productId) {
    await prisma.product.update({ where: { id: productId }, data });
  } else {
    await prisma.product.create({ data });
  }

  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
  redirect("/admin/produtos");
}

export async function deleteProductAction(productId: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/admin/produtos");
  revalidatePath("/produtos");
}
