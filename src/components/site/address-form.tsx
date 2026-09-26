"use client";

import { useActionState, useState } from "react";
import { saveAddressAction, type AddressFormState } from "@/lib/actions/addresses";
import { onlyDigits } from "@/lib/utils";

const initialState: AddressFormState = {};

export type AddressFormValues = {
  id?: string;
  label?: string;
  recipient?: string;
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  isDefault?: boolean;
};

export function AddressForm({ initial }: { initial?: AddressFormValues }) {
  const [state, formAction, pending] = useActionState(
    saveAddressAction,
    initialState,
  );
  const [fields, setFields] = useState({
    cep: initial?.cep || "",
    street: initial?.street || "",
    neighborhood: initial?.neighborhood || "",
    city: initial?.city || "",
    state: initial?.state || "",
  });
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");

  async function handleCepBlur() {
    const digits = onlyDigits(fields.cep);
    if (digits.length !== 8) return;

    setCepLoading(true);
    setCepError("");
    try {
      const res = await fetch(`/api/cep/${digits}`);
      const data = await res.json();
      if (!res.ok) {
        setCepError(data.error || "CEP não encontrado");
        return;
      }
      setFields((f) => ({
        ...f,
        street: data.street || f.street,
        neighborhood: data.neighborhood || f.neighborhood,
        city: data.city || f.city,
        state: data.state || f.state,
      }));
    } catch {
      setCepError("Erro ao consultar o CEP");
    } finally {
      setCepLoading(false);
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {initial?.id && <input type="hidden" name="addressId" value={initial.id} />}

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Identificação (ex: Casa, Trabalho)
        </label>
        <input
          type="text"
          name="label"
          defaultValue={initial?.label || "Principal"}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Nome do destinatário
        </label>
        <input
          type="text"
          name="recipient"
          defaultValue={initial?.recipient}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
        {state.fieldErrors?.recipient && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.recipient}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            CEP
          </label>
          <input
            type="text"
            name="cep"
            value={fields.cep}
            onChange={(e) => setFields((f) => ({ ...f, cep: e.target.value }))}
            onBlur={handleCepBlur}
            required
            maxLength={9}
            placeholder="00000-000"
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
          {cepLoading && <p className="mt-1 text-xs text-slate-400">Buscando...</p>}
          {cepError && <p className="mt-1 text-xs text-red-600">{cepError}</p>}
          {state.fieldErrors?.cep && (
            <p className="mt-1 text-xs text-red-600">{state.fieldErrors.cep}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            UF
          </label>
          <input
            type="text"
            name="state"
            value={fields.state}
            onChange={(e) =>
              setFields((f) => ({ ...f, state: e.target.value.toUpperCase() }))
            }
            required
            maxLength={2}
            className="w-full rounded-md border border-slate-300 px-3 py-2 uppercase"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Rua
        </label>
        <input
          type="text"
          name="street"
          value={fields.street}
          onChange={(e) => setFields((f) => ({ ...f, street: e.target.value }))}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Número
          </label>
          <input
            type="text"
            name="number"
            defaultValue={initial?.number}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Complemento
          </label>
          <input
            type="text"
            name="complement"
            defaultValue={initial?.complement}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Bairro
        </label>
        <input
          type="text"
          name="neighborhood"
          value={fields.neighborhood}
          onChange={(e) =>
            setFields((f) => ({ ...f, neighborhood: e.target.value }))
          }
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Cidade
        </label>
        <input
          type="text"
          name="city"
          value={fields.city}
          onChange={(e) => setFields((f) => ({ ...f, city: e.target.value }))}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          name="isDefault"
          defaultChecked={initial?.isDefault}
        />
        Definir como endereço padrão
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-slate-900 px-4 py-3 font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Salvar endereço"}
      </button>
    </form>
  );
}
