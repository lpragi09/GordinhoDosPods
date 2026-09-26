"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/actions/admin/guard";

export type CategoryFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function saveCategoryAction(
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  await requireAdmin();

  const raw = {
    name: String(formData.get("name") || ""),
    slug: String(formData.get("slug") || ""),
    description: String(formData.get("description") || ""),
    imageUrl: String(formData.get("imageUrl") || ""),
    active: formData.get("active") === "on",
    order: formData.get("order") || 0,
  };

  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  const categoryId = formData.get("categoryId")
    ? String(formData.get("categoryId"))
    : null;

  const existingSlug = await prisma.category.findFirst({
    where: { slug: parsed.data.slug, NOT: categoryId ? { id: categoryId } : undefined },
  });
  if (existingSlug) {
    return { fieldErrors: { slug: "Já existe uma categoria com esse slug." } };
  }

  const data = {
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description || null,
    imageUrl: parsed.data.imageUrl || null,
    active: parsed.data.active,
    order: parsed.data.order,
  };

  if (categoryId) {
    await prisma.category.update({ where: { id: categoryId }, data });
  } else {
    await prisma.category.create({ data });
  }

  revalidatePath("/admin/categorias");
  revalidatePath("/produtos");
  redirect("/admin/categorias");
}

export async function deleteCategoryAction(categoryId: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id: categoryId } });
  revalidatePath("/admin/categorias");
  revalidatePath("/produtos");
}
