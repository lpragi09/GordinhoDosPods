"use client";

import { useActionState } from "react";
import type { BannerFormState } from "@/lib/actions/admin/banners";

const initialState: BannerFormState = {};

export function BannerForm({
  action,
}: {
  action: (prevState: BannerFormState, formData: FormData) => Promise<BannerFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-md space-y-4">
      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">URL da imagem</label>
        <input
          type="text"
          name="imageUrl"
          required
          placeholder="https://exemplo.com/banner.jpg"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Título (opcional)</label>
        <input type="text" name="title" className="w-full rounded-md border border-slate-300 px-3 py-2" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Link de destino (opcional)</label>
        <input
          type="text"
          name="link"
          placeholder="/produtos?categoria=..."
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Ordem</label>
        <input
          type="number"
          name="order"
          defaultValue={0}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Adicionar banner"}
      </button>
    </form>
  );
}
