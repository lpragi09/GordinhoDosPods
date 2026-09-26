"use client";

import { useActionState } from "react";
import { saveSettingsAction, type SettingsFormState } from "@/lib/actions/admin/settings";

const initialState: SettingsFormState = {};

type Initial = {
  storeName: string;
  logoUrl: string | null;
  primaryColor: string;
  contactEmail: string | null;
  contactPhone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  address: string | null;
  freeShippingCents: number | null;
  flatShippingCents: number;
};

export function SettingsForm({ initial }: { initial: Initial }) {
  const [state, formAction, pending] = useActionState(saveSettingsAction, initialState);

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      {state.success && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Configurações salvas com sucesso!
        </p>
      )}
      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Nome da loja</label>
        <input
          type="text"
          name="storeName"
          defaultValue={initial.storeName}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">URL do logo</label>
        <input
          type="text"
          name="logoUrl"
          defaultValue={initial.logoUrl || ""}
          placeholder="https://exemplo.com/logo.png"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Cor principal</label>
        <input
          type="color"
          name="primaryColor"
          defaultValue={initial.primaryColor}
          className="h-10 w-20 rounded-md border border-slate-300"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">E-mail de contato</label>
          <input
            type="email"
            name="contactEmail"
            defaultValue={initial.contactEmail || ""}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Telefone</label>
          <input
            type="text"
            name="contactPhone"
            defaultValue={initial.contactPhone || ""}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">WhatsApp</label>
          <input
            type="text"
            name="whatsapp"
            defaultValue={initial.whatsapp || ""}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Instagram</label>
          <input
            type="text"
            name="instagram"
            defaultValue={initial.instagram || ""}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Endereço</label>
        <input
          type="text"
          name="address"
          defaultValue={initial.address || ""}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      <div className="rounded-lg border border-slate-200 p-4">
        <h3 className="mb-3 font-semibold text-slate-900">Frete</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Frete fixo (R$)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="flatShippingCentsInput"
              defaultValue={(initial.flatShippingCents / 100).toFixed(2)}
              onChange={(e) => {
                const input = document.getElementById("flatShippingCents") as HTMLInputElement;
                input.value = String(Math.round(Number(e.target.value || 0) * 100));
              }}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
            <input
              type="hidden"
              name="flatShippingCents"
              id="flatShippingCents"
              defaultValue={initial.flatShippingCents}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Frete grátis acima de (R$, opcional)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              defaultValue={
                initial.freeShippingCents ? (initial.freeShippingCents / 100).toFixed(2) : ""
              }
              onChange={(e) => {
                const input = document.getElementById("freeShippingCents") as HTMLInputElement;
                input.value = e.target.value
                  ? String(Math.round(Number(e.target.value) * 100))
                  : "";
              }}
              className="w-full rounded-md border border-slate-300 px-3 py-2"
            />
            <input
              type="hidden"
              name="freeShippingCents"
              id="freeShippingCents"
              defaultValue={initial.freeShippingCents ?? ""}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <p className="font-semibold">Credenciais do Mercado Pago</p>
        <p className="mt-1">
          Por segurança, o Access Token e a Public Key do Mercado Pago são configurados
          diretamente nas variáveis de ambiente do servidor (
          <code className="font-mono">MP_ACCESS_TOKEN</code> e{" "}
          <code className="font-mono">NEXT_PUBLIC_MP_PUBLIC_KEY</code>), não neste formulário.
          Consulte o README para instruções de deploy.
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-slate-900 px-6 py-3 font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Salvar configurações"}
      </button>
    </form>
  );
}
