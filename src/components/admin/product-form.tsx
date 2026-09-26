"use client";

import { useActionState, useState } from "react";
import { saveProductAction, type ProductFormState } from "@/lib/actions/admin/products";
import { slugify } from "@/lib/utils";

const initialState: ProductFormState = {};

type Category = { id: string; name: string };

type Initial = {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  priceCents?: number;
  compareCents?: number | null;
  sku?: string;
  stock?: number;
  images?: string[];
  categoryId?: string | null;
  active?: boolean;
  featured?: boolean;
  weightGrams?: number;
};

export function ProductForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: Initial;
}) {
  const [state, formAction, pending] = useActionState(saveProductAction, initialState);
  const [name, setName] = useState(initial?.name || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      {initial?.id && <input type="hidden" name="productId" value={initial.id} />}

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
        {state.fieldErrors?.name && (
          <p className="mt-1 text-xs text-red-600">{state.fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Slug (URL)</label>
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
        <label className="mb-1 block text-sm font-medium text-slate-700">Descrição</label>
        <textarea
          name="description"
          defaultValue={initial?.description}
          required
          rows={5}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Preço (R$)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="priceCentsInput"
            id="priceCentsInput"
            defaultValue={initial?.priceCents ? (initial.priceCents / 100).toFixed(2) : ""}
            onChange={(e) => {
              const input = document.getElementById("priceCents") as HTMLInputElement;
              input.value = String(Math.round(Number(e.target.value || 0) * 100));
            }}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
          <input type="hidden" name="priceCents" id="priceCents" defaultValue={initial?.priceCents} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Preço &quot;de&quot; (opcional)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            id="compareCentsInput"
            defaultValue={initial?.compareCents ? (initial.compareCents / 100).toFixed(2) : ""}
            onChange={(e) => {
              const input = document.getElementById("compareCents") as HTMLInputElement;
              input.value = e.target.value
                ? String(Math.round(Number(e.target.value) * 100))
                : "";
            }}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
          <input type="hidden" name="compareCents" id="compareCents" defaultValue={initial?.compareCents ?? ""} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">SKU</label>
          <input
            type="text"
            name="sku"
            defaultValue={initial?.sku}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
          {state.fieldErrors?.sku && (
            <p className="mt-1 text-xs text-red-600">{state.fieldErrors.sku}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Estoque</label>
          <input
            type="number"
            name="stock"
            min="0"
            defaultValue={initial?.stock ?? 0}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Categoria</label>
        <select
          name="categoryId"
          defaultValue={initial?.categoryId || ""}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        >
          <option value="">Sem categoria</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Imagens (uma URL por linha)
        </label>
        <textarea
          name="images"
          defaultValue={initial?.images?.join("\n")}
          rows={4}
          placeholder="https://exemplo.com/imagem1.jpg"
          className="w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-xs"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Peso (gramas, para frete)
        </label>
        <input
          type="number"
          name="weightGrams"
          min="0"
          defaultValue={initial?.weightGrams ?? 0}
          className="w-full rounded-md border border-slate-300 px-3 py-2"
        />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="active" defaultChecked={initial?.active ?? true} />
          Ativo (visível na loja)
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="featured" defaultChecked={initial?.featured ?? false} />
          Destaque na home
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-slate-900 px-6 py-3 font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Salvar produto"}
      </button>
    </form>
  );
}
