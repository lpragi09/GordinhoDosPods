import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AccountNav } from "@/components/site/account-nav";
import { AddressForm } from "@/components/site/address-form";
import { formatCep } from "@/lib/utils";

export default async function EditAddressPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const address = await prisma.address.findFirst({
    where: { id, userId: session!.user.id },
  });

  if (!address) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Minha conta</h1>

      <div className="flex flex-col gap-8 md:flex-row">
        <div className="md:w-56">
          <AccountNav current="/conta/enderecos" />
        </div>

        <div className="max-w-lg flex-1">
          <h2 className="mb-4 font-semibold text-foreground">Editar endereço</h2>
          <AddressForm
            initial={{
              id: address.id,
              label: address.label,
              recipient: address.recipient,
              cep: formatCep(address.cep),
              street: address.street,
              number: address.number,
              complement: address.complement || "",
              neighborhood: address.neighborhood,
              city: address.city,
              state: address.state,
              isDefault: address.isDefault,
            }}
          />
        </div>
      </div>
    </div>
  );
}
