"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/utils";
import { useMounted } from "@/lib/use-mounted";

export default function CartPage() {
  const { items, removeItem, setQuantity, totalCents } = useCartStore();
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Meu carrinho</h1>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-10 text-center">
          <p className="mb-4 text-slate-500">Seu carrinho está vazio.</p>
          <Link
            href="/produtos"
            className="inline-block rounded-md bg-slate-900 px-6 py-3 font-semibold text-white"
          >
            Ver produtos
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4 md:col-span-2">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 rounded-lg border border-slate-200 p-4"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-slate-100">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <Link
                    href={`/produtos/${item.slug}`}
                    className="font-medium text-slate-900 hover:underline"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-slate-500">
                    {formatCurrency(item.priceCents)}
                  </p>
                  <div className="mt-2 flex items-center rounded-md border border-slate-300 w-fit">
                    <button
                      className="px-3 py-1"
                      onClick={() =>
                        setQuantity(item.productId, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      className="px-3 py-1"
                      onClick={() =>
                        setQuantity(item.productId, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(item.priceCents * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-slate-400 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-lg border border-slate-200 p-5">
            <div className="mb-4 flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-semibold">{formatCurrency(totalCents())}</span>
            </div>
            <p className="mb-4 text-xs text-slate-400">
              Frete calculado no checkout.
            </p>
            <Link
              href="/checkout"
              className="block w-full rounded-md bg-slate-900 px-4 py-3 text-center font-semibold text-white hover:bg-slate-800"
            >
              Finalizar compra
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
