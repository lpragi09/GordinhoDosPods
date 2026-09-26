"use client";

import { useActionState, useState } from "react";
import { saveCategoryAction, type CategoryFormState } from "@/lib/actions/admin/categories";
import { slugify } from "@/lib/utils";

const initialState: CategoryFormState = {};

type Initial = {
  id?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  imageUrl?: string | null;
  active?: boolean;
  order?: number;
};

export function CategoryForm({ initial }: { initial?: Initial }) {
  const [state, formAction, pending] = useActionState(saveCategoryAction, initialState);
  const [name, setName] = useState(initial?.name || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));

  return (
    <form action={formAction} className="max-w-lg space-y-5">
      {initial?.id && <input type="hidden" name="categoryId" value={initial.id} />}

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Nome</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Slug</label>
        <input
          type="text"
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlug(slugify(e.target.value));
            setSlugTouched(true);
          }}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-sm"
        />
        {state.fieldErrors?.slug && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.slug}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Descrição (opcional)
        </label>
        <textarea
          name="description"
          defaultValue={initial?.description || ""}
          rows={3}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          URL da imagem (opcional)
        </label>
        <input
          type="text"
          name="imageUrl"
          defaultValue={initial?.imageUrl || ""}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Ordem de exibição
        </label>
        <input
          type="number"
          name="order"
          defaultValue={initial?.order ?? 0}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="active" defaultChecked={initial?.active ?? true} />
        Ativa (visível na loja)
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-slate-900 px-6 py-3 font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Salvar categoria"}
      </button>
    </form>
  );
}
