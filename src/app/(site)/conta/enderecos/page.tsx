import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AccountNav } from "@/components/site/account-nav";
import { formatCep } from "@/lib/utils";
import { DeleteAddressButton } from "@/components/site/delete-address-button";

export default async function AddressesPage() {
  const session = await auth();
  const addresses = await prisma.address.findMany({
    where: { userId: session!.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Minha conta</h1>

      <div className="flex flex-col gap-8 md:flex-row">
        <div className="md:w-56">
          <AccountNav current="/conta/enderecos" />
        </div>

        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Meus endereços</h2>
            <Link
              href="/conta/enderecos/novo"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Novo endereço
            </Link>
          </div>

          {addresses.length === 0 ? (
            <p className="text-slate-500">Nenhum endereço cadastrado.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold text-slate-900">
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-medium text-white">
                        Padrão
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">
                    {addr.recipient}
                    <br />
                    {addr.street}, {addr.number}
                    {addr.complement ? ` - ${addr.complement}` : ""}
                    <br />
                    {addr.neighborhood} - {addr.city}/{addr.state}
                    <br />
                    CEP {formatCep(addr.cep)}
                  </p>
                  <div className="mt-3 flex gap-3 text-sm">
                    <Link
                      href={`/conta/enderecos/${addr.id}/editar`}
                      className="font-medium text-slate-700 hover:underline"
                    >
                      Editar
                    </Link>
                    <DeleteAddressButton addressId={addr.id} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
