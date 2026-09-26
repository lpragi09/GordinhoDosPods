"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";

type Props = {
  productId: string;
  name: string;
  slug: string;
  priceCents: number;
  imageUrl?: string | null;
  stock: number;
};

export function AddToCart({
  productId,
  name,
  slug,
  priceCents,
  imageUrl,
  stock,
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  if (stock <= 0) {
    return (
      <div className="rounded-md bg-slate-100 px-4 py-3 text-sm font-medium text-slate-500">
        Produto indisponível no momento
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-slate-700">Quantidade</label>
        <div className="flex items-center rounded-md border border-slate-300">
          <button
            type="button"
            className="px-3 py-1 text-lg"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            -
          </button>
          <span className="w-10 text-center">{quantity}</span>
          <button
            type="button"
            className="px-3 py-1 text-lg"
            onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
          >
            +
          </button>
        </div>
        <span className="text-xs text-slate-500">{stock} em estoque</span>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            addItem(
              { productId, name, slug, priceCents, imageUrl, maxStock: stock },
              quantity,
            );
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
          }}
          className="flex-1 rounded-md bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800"
        >
          {added ? "Adicionado!" : "Adicionar ao carrinho"}
        </button>
        <button
          type="button"
          onClick={() => {
            addItem(
              { productId, name, slug, priceCents, imageUrl, maxStock: stock },
              quantity,
            );
            router.push("/carrinho");
          }}
          className="flex-1 rounded-md border border-slate-900 px-6 py-3 font-semibold text-slate-900 hover:bg-slate-100"
        >
          Comprar agora
        </button>
      </div>
    </div>
  );
}
