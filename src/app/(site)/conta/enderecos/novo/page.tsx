import { AccountNav } from "@/components/site/account-nav";
import { AddressForm } from "@/components/site/address-form";

export default function NewAddressPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Minha conta</h1>

      <div className="flex flex-col gap-8 md:flex-row">
        <div className="md:w-56">
          <AccountNav current="/conta/enderecos" />
        </div>

        <div className="max-w-lg flex-1">
          <h2 className="mb-4 font-semibold text-slate-900">Novo endereço</h2>
          <AddressForm />
        </div>
      </div>
    </div>
  );
}
