"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addressSchema } from "@/lib/validations";

export type AddressFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

async function requireUserId() {
  const session = await auth();
  if (!session?.user) redirect("/conta/entrar");
  return session.user.id;
}

export async function saveAddressAction(
  _prevState: AddressFormState,
  formData: FormData,
): Promise<AddressFormState> {
  const userId = await requireUserId();

  const raw = {
    label: String(formData.get("label") || "Principal"),
    recipient: String(formData.get("recipient") || ""),
    cep: String(formData.get("cep") || ""),
    street: String(formData.get("street") || ""),
    number: String(formData.get("number") || ""),
    complement: String(formData.get("complement") || ""),
    neighborhood: String(formData.get("neighborhood") || ""),
    city: String(formData.get("city") || ""),
    state: String(formData.get("state") || "").toUpperCase(),
    isDefault: formData.get("isDefault") === "on",
  };

  const parsed = addressSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  const addressId = formData.get("addressId")
    ? String(formData.get("addressId"))
    : null;

  if (parsed.data.isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  if (addressId) {
    await prisma.address.update({
      where: { id: addressId, userId },
      data: parsed.data,
    });
  } else {
    await prisma.address.create({
      data: { ...parsed.data, userId },
    });
  }

  revalidatePath("/conta/enderecos");
  redirect("/conta/enderecos");
}

export async function deleteAddressAction(addressId: string) {
  const userId = await requireUserId();
  await prisma.address.delete({ where: { id: addressId, userId } });
  revalidatePath("/conta/enderecos");
}

export async function setDefaultAddressAction(addressId: string) {
  const userId = await requireUserId();
  await prisma.$transaction([
    prisma.address.updateMany({ where: { userId }, data: { isDefault: false } }),
    prisma.address.update({ where: { id: addressId, userId }, data: { isDefault: true } }),
  ]);
  revalidatePath("/conta/enderecos");
}
